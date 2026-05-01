import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product/ProductCard'
import { FilterSidebar } from '@/app/coleccion/FilterSidebar'

export default async function OffersPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select(`
      id, name, base_price, is_new, is_on_sale, sale_price,
      product_variants (id, image_url)
    `)
    .eq('is_on_sale', true)
    .order('created_at', { ascending: false })

  const formattedProducts = products?.map(p => ({
    id: p.id,
    name: p.name,
    price: p.sale_price || p.base_price,
    originalPrice: p.base_price,
    imageUrl: p.product_variants?.[0]?.image_url || '',
    category: 'Oferta',
    isNew: p.is_new,
    isOnSale: p.is_on_sale
  })) || []

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-16 text-center space-y-4">
        <span className="text-[11px] font-sans font-black uppercase tracking-[0.4em] text-accent">Special Archive Prices</span>
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
