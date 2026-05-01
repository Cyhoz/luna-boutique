import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { AlertTriangle, Package, CheckCircle, Clock, Truck, Plus, FileText } from 'lucide-react'
import { ProductList } from './ProductList'

export default async function AdminPage() {
  const supabase = await createClient()

  // Verificar si el usuario está autenticado y es admin
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // Obtener productos con variantes para inventario
  const { data: products } = await supabase
    .from('products')
    .select(`
      id, name, base_price, is_active, is_new, is_on_sale, sale_price,
      product_variants (id, size, color, stock_quantity, image_url)
    `)
    .order('created_at', { ascending: false })

  // Calcular alertas de stock
  const lowStockThreshold = 5
  const lowStockItems = products?.flatMap(p => 
    p.product_variants
      ?.filter((v: any) => v.stock_quantity <= lowStockThreshold)
      .map((v: any) => ({ ...v, productName: p.name }))
  ) || []

  const outOfStockItems = lowStockItems.filter(item => item.stock_quantity === 0)
  const criticalStockItems = lowStockItems.filter(item => item.stock_quantity > 0 && item.stock_quantity <= 2)

  async function addProduct(formData: FormData) {
    'use server'
    const supabaseServer = await createClient()
    
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const base_price = parseFloat(formData.get('base_price') as string)
    const size = formData.get('size') as string
    const color = formData.get('color') as string
    const stock_quantity = parseInt(formData.get('stock') as string) || 0
    const is_new = formData.get('is_new') === 'on'
    const is_on_sale = formData.get('is_on_sale') === 'on'
    const sale_price = formData.get('sale_price') ? parseFloat(formData.get('sale_price') as string) : null
    const imageFile = formData.get('image') as File
    
    const slug = name.toLowerCase().replace(/ /g, '-') + '-' + Date.now()

    const { data: product, error: productError } = await supabaseServer
      .from('products')
      .insert({ name, description, base_price, slug, is_new, is_on_sale, sale_price })
      .select()
      .single()

    if (productError) return

    let publicImageUrl = ''
    if (imageFile && imageFile.size > 0) {
      const fileName = `${product.id}-${Date.now()}`
      const { error: uploadError } = await supabaseServer.storage
        .from('product-images')
        .upload(fileName, imageFile)

      if (!uploadError) {
        const { data: { publicUrl } } = supabaseServer.storage
          .from('product-images')
          .getPublicUrl(fileName)
        publicImageUrl = publicUrl
      }
    }

    if (product) {
      await supabaseServer.from('product_variants').insert({
        product_id: product.id,
        size: size || 'M',
        color: color || 'Único',
        stock_quantity: stock_quantity,
        image_url: publicImageUrl || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800'
      })
    }
    
    revalidatePath('/admin')
    revalidatePath('/')
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .in('status', ['paid', 'shipped'])
    .order('created_at', { ascending: false })

  async function markAsShipped(formData: FormData) {
    'use server'
    const supabaseServer = await createClient()
    const orderId = formData.get('orderId') as string
    const trackingNumber = formData.get('trackingNumber') as string

    await supabaseServer.from('orders').update({
      shipping_status: 'enviado',
      status: 'shipped',
      tracking_number: trackingNumber
    }).eq('id', orderId)

    revalidatePath('/admin')
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter font-display uppercase">Control Center</h1>
          <p className="text-zinc-500 mt-1 uppercase text-[10px] font-black tracking-widest">Gestión de Inventario y Operaciones</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
            <FileText className="h-4 w-4" /> Lista de Reposición
          </button>
        </div>
      </div>

      {/* DASHBOARD SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg"><Package className="h-5 w-5 text-blue-500" /></div>
            <span className="text-[10px] font-black text-zinc-400 uppercase">Productos</span>
          </div>
          <p className="text-3xl font-bold font-display">{products?.length || 0}</p>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-tighter">En catálogo activo</p>
        </div>

        <div className={`p-6 rounded-2xl border shadow-sm transition-all ${outOfStockItems.length > 0 ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900' : 'bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${outOfStockItems.length > 0 ? 'bg-red-500/20' : 'bg-zinc-100'}`}><AlertTriangle className={`h-5 w-5 ${outOfStockItems.length > 0 ? 'text-red-500' : 'text-zinc-400'}`} /></div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Agotados</span>
          </div>
          <p className={`text-3xl font-bold font-display ${outOfStockItems.length > 0 ? 'text-red-600 dark:text-red-400' : ''}`}>{outOfStockItems.length}</p>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-tighter">Requieren reposición inmediata</p>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg"><Clock className="h-5 w-5 text-amber-500" /></div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Pendientes</span>
          </div>
          <p className="text-3xl font-bold font-display">{orders?.filter(o => o.status === 'paid').length || 0}</p>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-tighter">Órdenes por despachar</p>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg"><CheckCircle className="h-5 w-5 text-emerald-500" /></div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Completados</span>
          </div>
          <p className="text-3xl font-bold font-display">{orders?.filter(o => o.status === 'shipped').length || 0}</p>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-tighter">Envíos realizados hoy</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 mb-12">
        {/* Formulario Izquierdo (4 col) */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-900 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-zinc-900 dark:bg-white rounded-xl"><Plus className="h-5 w-5 text-white dark:text-zinc-900" /></div>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight">Nuevo Producto</h2>
            </div>
            <form action={addProduct} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Nombre</label>
                <input required name="name" type="text" className="w-full rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-900 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Descripción</label>
                <textarea required name="description" className="w-full rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-900 transition-all h-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Precio ($)</label>
                  <input required name="base_price" type="number" step="0.01" className="w-full rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-900 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Stock Inicial</label>
                  <input required name="stock" type="number" className="w-full rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-900 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Talla</label>
                  <input required name="size" type="text" className="w-full rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-900 transition-all" placeholder="M, L, Única" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Color</label>
                  <input required name="color" type="text" className="w-full rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-900 transition-all" placeholder="Onyx, Black" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input name="is_new" type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Novedad</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input name="is_on_sale" type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-red-500 focus:ring-red-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Oferta</span>
                </label>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Precio de Oferta (Opcional)</label>
                <input name="sale_price" type="number" step="0.01" className="w-full rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 transition-all" placeholder="Precio rebajado..." />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Imagen</label>
                <input required name="image" type="file" accept="image/*" className="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-zinc-900 file:text-white dark:file:bg-white dark:file:text-zinc-900 cursor-pointer" />
              </div>
              <button type="submit" className="premium-button w-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all hover:scale-[1.02]">
                Publicar Producto
              </button>
            </form>
          </div>
        </div>

        {/* Lista Derecha (8 col) */}
        <div className="lg:col-span-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold font-display uppercase tracking-tight">Inventario & Edición</h2>
            {lowStockItems.length > 0 && (
              <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {lowStockItems.length} Alertas de Stock
              </span>
            )}
          </div>
          
          <ProductList products={products || []} />
        </div>
      </div>

      {/* SECCIÓN LOGÍSTICA */}
      <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-900 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl"><Truck className="h-5 w-5 text-zinc-900 dark:text-white" /></div>
            <h2 className="text-xl font-bold font-display uppercase tracking-tight">Despachos Pendientes</h2>
          </div>
        </div>
        
        {(!orders || orders.length === 0) ? (
          <div className="p-20 text-center">
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No hay despachos programados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <th className="px-8 py-4">Orden</th>
                  <th className="px-8 py-4">Destinatario</th>
                  <th className="px-8 py-4">Estado</th>
                  <th className="px-8 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-sm">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="px-8 py-4">
                      <p className="font-bold">ORD-{order.id.split('-')[0].toUpperCase()}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-4">
                      <p className="font-bold text-zinc-700 dark:text-zinc-300">{order.shipping_address}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{order.city}</p>
                    </td>
                    <td className="px-8 py-4">
                      {order.status === 'paid' ? (
                        <span className="flex items-center gap-1.5 text-amber-500 font-black uppercase text-[10px] tracking-widest">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Pendiente Envío
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-emerald-500 font-black uppercase text-[10px] tracking-widest">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Enviado
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-4 text-right">
                      {order.status === 'paid' && (
                        <form action={markAsShipped} className="flex items-center justify-end gap-2">
                          <input type="hidden" name="orderId" value={order.id} />
                          <input required name="trackingNumber" type="text" placeholder="Trk #" className="w-24 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-3 py-1.5 text-[10px] font-bold outline-none" />
                          <button type="submit" className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                            Enviar
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
