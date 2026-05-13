import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product/ProductCard'
import { FilterSidebar } from '@/app/coleccion/FilterSidebar'

export default async function OffersPage() {
  const supabase = await createClient()

  // Buscamos productos que tengan al menos una variante con precio_descuento
  const { data: products } = await supabase
    .from('producto')
    .select(`
      id_producto, nombre,
      variante_producto!inner (id_variante, imagen_url, precio, precio_descuento, stock_actual)
    `)
    .eq('estado', 'activo')
    .not('variante_producto.precio_descuento', 'is', null)

  const formattedProducts = products?.map(p => {
    const v = p.variante_producto?.[0] || {}
    return {
      id: p.id_producto,
      name: p.nombre,
      price: v.precio_descuento || v.precio || 0,
      originalPrice: v.precio || 0,
      imageUrl: v.imagen_url || '',
      category: 'Oferta',
      stock: v.stock_actual || 0
    }
  }) || []

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-16 text-center space-y-4">
        <span className="text-[11px] font-sans font-black uppercase tracking-[0.4em] text-[#db2777]">Special Archive Prices</span>
        <h1 className="text-5xl md:text-8xl font-serif font-medium text-primary italic leading-tight">Ofertas</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <FilterSidebar />
        
        <div className="flex-1">
          {formattedProducts.length === 0 ? (
            <div className="py-20 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No hay ofertas disponibles en este momento.</p>
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
