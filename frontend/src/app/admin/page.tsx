import { createClient as serverSupabase } from '@/lib/supabase/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { AlertTriangle, Package, CheckCircle, Clock, Truck, Plus, Sparkles, MapPin, Search, Moon, Stars, Settings } from 'lucide-react'
import { ProductList } from './ProductList'
import { StockAlerts } from './StockAlerts'
import { InventoryHistory } from './InventoryHistory'
import { ConfigForms } from './ConfigForms'
import { CustomerList } from './CustomerList'
import { Metadata } from 'next'
import { addProduct, markAsShipped, getCategories, getColors } from '@/services/adminService'
import { ShippingButton } from '@/components/admin/ShippingButton'
import { DeleteOrderButton } from '@/components/admin/DeleteOrderButton'
import { BulkDeleteOrdersForm } from '@/components/admin/BulkDeleteOrdersForm'
import Link from 'next/link'
import { formatPrice } from '@/utils/formatters'
import { AdminSearch } from './AdminSearch'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Luna Boutique | Centro de Control',
  robots: { index: false, follow: false }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const q = params.q as string || ''

  const authSupabase = await serverSupabase()

  // 1. Verificación de Seguridad (Usamos el cliente con cookies)
  const { data: { user } } = await authSupabase.auth.getUser()
  
  if (!user) redirect('/login')

  // 2. Carga de Datos (Usamos el cliente ADMIN para saltar caché y RLS)
  const supabase = adminSupabase

  // Cargamos categorías y colores para los select del formulario
  const categories = await getCategories()
  const colors = await getColors()

  // 2. Carga de Datos Compleja (Joins) - Basado en MER
  let productsQuery = supabase
    .from('producto')
    .select(`
      id_producto, nombre, estado, marca, genero, material,
      id_categoria,
      categoria (nombre),
      variante_producto (
        id_variante, 
        talla, 
        sku,
        precio,
        id_color,
        color:id_color (nombre, codigo_hex), 
        inventario (stock_actual, stock_minimo)
      ),
      imagen_producto (url_imagen, es_principal)
    `)
    .order('fecha_creacion', { ascending: false })

  if (q) {
    productsQuery = productsQuery.ilike('nombre', `%${q}%`)
  }

  const { data: products } = await productsQuery

  // Obtenemos pedidos con información de cliente, envío y DETALLES (para el profe)
  const { data: orders } = await supabase
    .from('pedido')
    .select(`
      id_pedido, total, estado, fecha_pedido,
      cliente (nombre, email),
      envio (id_envio, paqueteria, numero_guia, estado),
      detalle_pedido (
        id_detalle_pedido,
        cantidad,
        precio_unitario,
        subtotal,
        variante_producto (
          talla,
          producto (nombre),
          color:id_color (nombre)
        )
      )
    `)
    .in('estado', ['pendiente', 'pagado', 'enviado', 'entregado'])
    .order('fecha_pedido', { ascending: false })

  // Obtenemos lista de clientes
  const { data: clientes } = await supabase
    .from('cliente')
    .select('*')
    .order('fecha_registro', { ascending: false })

  // 3. Cálculo de KPIs
  const totalProducts = products?.length || 0
  const { data: alerts } = await supabase.from('vista_alertas_stock').select('*')
  const lowStockAlerts = alerts?.length || 0

  const pendingShipments = orders?.filter(o => o.estado === 'pagado' || o.estado === 'pendiente').length || 0
  const completedToday = orders?.filter(o => o.estado === 'enviado').length || 0

  return (
    <div className="min-h-screen lunar-gradient relative overflow-hidden pb-20">
      {/* Background Decor */}
      <Stars className="absolute top-20 right-20 text-white/5 animate-twinkle" />
      <Moon className="absolute top-40 left-10 text-white/5 animate-float" />

      <div className="container mx-auto px-6 py-12 max-w-7xl relative z-10">
        
        {/* Header - Cinematic */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-[#eab308]" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-500">Administración Central</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-medium text-white tracking-tighter">
              Boutique <span className="gold-text italic">Command.</span>
            </h1>
          </div>
          
          <div className="flex gap-4">
            <AdminSearch />
            <a href="#config-section" className="w-14 h-14 glass rounded-2xl flex items-center justify-center border-white/5 hover:bg-white/5 transition-all">
              <Settings className="h-5 w-5 text-zinc-500" />
            </a>
          </div>
        </div>

        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="glass rounded-[2.5rem] p-8 border-white/5 shadow-xl group hover:border-white/10 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-blue-400 border-white/5">
                <Package className="h-6 w-6" />
              </div>
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Catálogo</span>
            </div>
            <p className="text-4xl font-serif text-white tracking-tighter">{totalProducts}</p>
            <p className="text-[9px] text-zinc-500 mt-2 uppercase font-bold tracking-widest">Piezas activas en galería</p>
          </div>

          <div className={`glass rounded-[2.5rem] p-8 border-white/5 shadow-xl transition-all ${lowStockAlerts > 0 ? 'ring-1 ring-red-500/30' : ''}`}>
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 glass rounded-2xl flex items-center justify-center border-white/5 ${lowStockAlerts > 0 ? 'text-red-500 animate-pulse' : 'text-zinc-500'}`}>
                <AlertTriangle className="h-6 w-6" />
              </div>
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Existencias</span>
            </div>
            <p className={`text-4xl font-serif tracking-tighter ${lowStockAlerts > 0 ? 'text-red-500' : 'text-white'}`}>{lowStockAlerts}</p>
            <p className="text-[9px] text-zinc-500 mt-2 uppercase font-bold tracking-widest">Alertas de stock bajo</p>
          </div>

          <div className="glass rounded-[2.5rem] p-8 border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-[#eab308] border-white/5">
                <Clock className="h-6 w-6" />
              </div>
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Logística</span>
            </div>
            <p className="text-4xl font-serif text-white tracking-tighter">{pendingShipments}</p>
            <p className="text-[9px] text-zinc-500 mt-2 uppercase font-bold tracking-widest">Órdenes pendientes</p>
          </div>

          <div className="glass rounded-[2.5rem] p-8 border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-emerald-400 border-white/5">
                <CheckCircle className="h-6 w-6" />
              </div>
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Cierre</span>
            </div>
            <p className="text-4xl font-serif text-white tracking-tighter">{completedToday}</p>
            <p className="text-[9px] text-zinc-500 mt-2 uppercase font-bold tracking-widest">Completados hoy</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* New Product Form - Left Column */}
          <div className="lg:col-span-5">
            <div className="glass rounded-[3rem] p-10 border-white/5 shadow-2xl sticky top-8">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white border-white/10">
                  <Plus className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-serif font-medium text-white italic">Nueva Pieza Maestro</h2>
              </div>
              
              <form action={addProduct} className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Nombre y Colección</label>
                  <input required name="nombre" type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all" placeholder="EJ: VESTIDO LUNAR VELVET" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Categoría</label>
                    <select name="id_categoria" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all appearance-none">
                      <option value="">Sin Categoría</option>
                      {categories.map((c) => (
                        <option key={c.id_categoria} value={c.id_categoria} className="bg-zinc-900">{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Marca</label>
                    <input name="marca" type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all" placeholder="EJ: LUNA" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Material</label>
                    <input name="material" type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all" placeholder="EJ: SEDA" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Género</label>
                    <select name="genero" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all appearance-none">
                      <option value="Unisex" className="bg-zinc-900">Unisex</option>
                      <option value="Mujer" className="bg-zinc-900">Mujer</option>
                      <option value="Hombre" className="bg-zinc-900">Hombre</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] space-y-6">
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Variante Maestro (Inicial)</p>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Talla</label>
                        <input required name="talla" type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all" placeholder="S, M, L..." />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Color</label>
                        <select name="id_color" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all appearance-none">
                          <option value="">Base</option>
                          {colors.map((c) => (
                            <option key={c.id_color} value={c.id_color} className="bg-zinc-900">{c.nombre}</option>
                          ))}
                        </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Precio Unitario</label>
                        <input required name="precio" type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all" />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Stock Inicial</label>
                        <input required name="stock_actual" type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all" />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">SKU Personalizado (Opcional)</label>
                      <input name="sku" type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all" placeholder="EJ: VST-LUN-001" />
                   </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">URL de Imagen Maestro</label>
                  <input required name="imagen_url" type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all" placeholder="HTTPS://..." />
                </div>

                <button type="submit" className="w-full h-16 rounded-[1.5rem] bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#eab308] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 shadow-xl">
                  Publicar en Galería
                </button>
              </form>
            </div>

            {/* Forms for Categories and Colors */}
            <div id="config-section" className="mt-12 scroll-mt-32">
              <div className="flex items-center gap-4 mb-8 ml-6">
                 <Settings className="h-4 w-4 text-zinc-500" />
                 <h2 className="text-xl font-serif text-white/50 italic">Configuración de Atributos</h2>
              </div>
              <ConfigForms />
            </div>
          </div>

          {/* Logistics & Inventory - Right Column */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Active Orders - Logistics */}
            <div className="glass rounded-[3.5rem] border-white/5 shadow-2xl overflow-hidden">
              <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-[#db2777] border-white/10">
                    <Truck className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-serif font-medium text-white italic">Logística de Despachos</h2>
                </div>
              </div>

              {(!orders || orders.length === 0) ? (
                <div className="p-20 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">Sin movimientos galácticos pendientes</p>
                </div>
              ) : (
                <BulkDeleteOrdersForm>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/[0.02] text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">
                          <th className="px-6 py-6 w-10"></th>
                        <th className="px-10 py-6">Adquisición</th>
                        <th className="px-10 py-6">Destinatario</th>
                        <th className="px-10 py-6">Estado Actual</th>
                        <th className="px-10 py-6 text-right">Maniobra</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {/* 1. PEDIDOS PAGADOS (PRIORIDAD ALTA) */}
                      {orders.filter((o: any) => o.estado === 'pagado').map((order: any) => (
                        <tr key={order.id_pedido} className="group bg-[#eab308]/5 hover:bg-[#eab308]/10 transition-all border-l-4 border-[#eab308]">
                          <td className="px-6 py-8">
                            <input type="checkbox" name="orderIds" value={order.id_pedido} className="accent-[#eab308] w-4 h-4 rounded cursor-pointer" />
                          </td>
                          <td className="px-10 py-8">
                            <p className="text-xs font-black text-white uppercase tracking-widest">ORD-{order.id_pedido.split('-')[0]}</p>
                            <p className="text-[9px] text-zinc-600 mt-1 uppercase font-bold tracking-widest">{new Date(order.fecha_pedido).toLocaleDateString()}</p>
                            <div className="mt-4 p-4 rounded-2xl bg-black/20 border border-white/5 space-y-3">
                               <p className="text-[8px] font-black text-[#eab308] uppercase tracking-[0.2em] mb-2">Artículos Pagados:</p>
                               {order.detalle_pedido?.map((item: any) => (
                                 <div key={item.id_detalle_pedido} className="flex justify-between items-center gap-4 text-[9px] text-zinc-400">
                                    <span className="truncate max-w-[120px]">{item.variante_producto?.producto?.nombre}</span>
                                    <span className="font-bold text-white">x{item.cantidad}</span>
                                 </div>
                               ))}
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-3">
                              <MapPin className="h-3 w-3 text-zinc-600" />
                              <div>
                                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{order.cliente?.nombre || 'ANÓNIMO'}</p>
                                <p className="text-[9px] text-zinc-600 mt-1 uppercase">LISTO PARA ENVIAR</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#eab308] text-black">
                              <Sparkles className="w-2 h-2 animate-twinkle" /> PAGADO
                            </span>
                          </td>
                          <td className="px-10 py-8 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <DeleteOrderButton orderId={order.id_pedido} />
                              <ShippingButton orderId={order.id_pedido} />
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* 2. PEDIDOS ENVIADOS (HISTORIAL) */}
                      {orders.filter((o: any) => o.estado === 'enviado').map((order: any) => (
                        <tr key={order.id_pedido} className="opacity-50 hover:opacity-100 transition-opacity">
                          <td className="px-6 py-8">
                            <input type="checkbox" name="orderIds" value={order.id_pedido} className="accent-red-500 w-4 h-4 rounded cursor-pointer" />
                          </td>
                          <td className="px-10 py-8">
                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">ORD-{order.id_pedido.split('-')[0]}</p>
                          </td>
                          <td className="px-10 py-8">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{order.cliente?.nombre}</p>
                            <p className="text-[8px] text-zinc-700 mt-1">{order.envio?.[0]?.paqueteria}: {order.envio?.[0]?.numero_guia}</p>
                          </td>
                          <td className="px-10 py-8">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              ENVIADO
                            </span>
                          </td>
                          <td className="px-10 py-8 text-right">
                            <div className="flex items-center justify-end gap-4">
                              <span className="italic text-zinc-700 text-[9px]">Completado</span>
                              <DeleteOrderButton orderId={order.id_pedido} />
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* 3. PEDIDOS PENDIENTES (POSIBLES ABANDONOS) */}
                      {orders.filter((o: any) => o.estado === 'pendiente').map((order: any) => (
                        <tr key={order.id_pedido} className="opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                          <td className="px-6 py-8">
                            <input type="checkbox" name="orderIds" value={order.id_pedido} className="accent-red-500 w-4 h-4 rounded cursor-pointer" />
                          </td>
                          <td className="px-10 py-8 text-zinc-600 text-[10px]">Abandonado/Pendiente</td>
                          <td className="px-10 py-8 text-zinc-600 text-[10px]">{order.cliente?.email}</td>
                          <td className="px-10 py-8">
                             <span className="text-[8px] border border-zinc-800 text-zinc-700 px-3 py-1 rounded-full uppercase tracking-tighter">Expirado</span>
                          </td>
                          <td className="px-10 py-8 text-right">
                             <div className="flex items-center justify-end gap-4">
                               <p className="text-[9px] text-zinc-800">No concretado</p>
                               <DeleteOrderButton orderId={order.id_pedido} />
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </BulkDeleteOrdersForm>
              )}
            </div>

            {/* Inventory Monitoring - Right Column */}
            <div className="space-y-16">
              <StockAlerts />
              <InventoryHistory />

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif font-medium text-white italic">Inventario Maestro</h2>
                  <div className="flex items-center gap-4">
                    <div className="h-[1px] w-12 bg-white/10" />
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{products?.length} MODELOS</p>
                  </div>
                </div>
                <ProductList products={products || []} />
              </div>

              {/* Customer List - Full Visibility */}
              <div className="pt-20">
                <div className="flex items-center justify-between mb-10">
                   <h2 className="text-2xl font-serif font-medium text-white italic">Base de Clientes</h2>
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{clientes?.length} REGISTRADOS</p>
                </div>
                <CustomerList clientes={clientes || []} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
