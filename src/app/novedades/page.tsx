import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product/ProductCard'
import { FilterSidebar } from '@/app/coleccion/FilterSidebar'

export default async function NewArrivalsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select(`
      id, name, base_price, is_new, is_on_sale, sale_price,
      product_variants (id, image_url)
    `)
    .eq('is_new', true)
    .order('created_at', { ascending: false })

  const formattedProducts = products?.map(p => ({
    id: p.id,
    name: p.name,
    price: p.sale_price || p.base_price,
    originalPrice: p.base_price,
    imageUrl: p.product_variants?.[0]?.image_url || '',
    category: 'Novedad',
    isNew: p.is_new,
    isOnSale: p.is_on_sale
  })) || []

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
