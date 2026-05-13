import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product/ProductCard'
import { FilterSidebar } from '@/app/coleccion/FilterSidebar'

export default async function NewArrivalsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('producto')
    .select(`
      id_producto, nombre,
      variante_producto (id_variante, imagen_url, precio, precio_descuento, stock_actual)
    `)
    .eq('estado', 'activo')
    .order('fecha_creacion', { ascending: false })
    .limit(12)

  const formattedProducts = products?.map(p => {
    const v = p.variante_producto?.[0] || {}
    return {
      id: p.id_producto,
      name: p.nombre,
      price: v.precio_descuento || v.precio || 0,
      originalPrice: v.precio || 0,
      imageUrl: v.imagen_url || '',
      category: 'Novedad',
      stock: v.stock_actual || 0
    }
  }) || []

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-12 text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2 block">The Latest Drops</span>
        <h1 className="text-4xl md:text-7xl font-bold font-display uppercase tracking-tight">Novedades</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <FilterSidebar />
        
        <div className="flex-1">
          {formattedProducts.length === 0 ? (
            <div className="py-20 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No hay novedades registradas en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {formattedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
