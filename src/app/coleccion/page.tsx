import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product/ProductCard'
import { FilterSidebar } from './FilterSidebar'
import { Suspense } from 'react'
import { Moon, Sparkles } from 'lucide-react'

export default async function ColeccionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const categoria = params.categoria as string
  const stockOnly = params.stock === 'true'
  const maxPrice = params.precio ? parseInt(params.precio as string) : null

  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`
      id, name, base_price, is_new, is_on_sale, sale_price,
      categories (id, name),
      product_variants (id, size, color, stock_quantity, image_url)
    `)
    .eq('is_active', true)

  if (maxPrice) {
    query = query.lte('base_price', maxPrice)
  }

  const { data: dbProducts } = await query

  let formattedProducts = dbProducts?.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.sale_price || p.base_price,
    originalPrice: p.base_price,
    category: p.categories?.name || 'COLECCIÓN',
    imageUrl: p.product_variants?.[0]?.image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800',
    isNew: p.is_new,
    isOnSale: p.is_on_sale,
    variants: p.product_variants || []
  })) || []

  // Filtros adicionales en memoria para mayor flexibilidad en la demo
  if (categoria) {
    formattedProducts = formattedProducts.filter(p => p.category.toUpperCase() === categoria.toUpperCase())
  }

  if (stockOnly) {
    formattedProducts = formattedProducts.filter(p => 
      p.variants.some((v: any) => v.stock_quantity > 0)
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-7xl">
      {/* Header del Catálogo - Boutique Style */}
      <div className="mb-20 text-center space-y-6">
        <div className="flex justify-center items-center gap-3">
          <Moon className="h-4 w-4 text-accent" />
          <span className="text-[11px] font-sans font-black uppercase tracking-[0.5em] text-accent">Catálogo Curado</span>
        </div>
        <h1 className="text-5xl sm:text-8xl font-serif font-medium text-primary italic leading-tight">
          La Colección.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
          Nuestra línea completa de piezas atemporales diseñadas para el hombre y la mujer contemporáneos. 
          Encuentra tu próximo esencial.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Sidebar de Filtros */}
        <Suspense fallback={<div className="w-64 animate-pulse bg-muted h-96 rounded-[2.5rem]"></div>}>
          <FilterSidebar />
        </Suspense>

        {/* Grilla de Productos */}
        <div className="flex-1 w-full">
          {/* Barra de utilidades top */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 pb-6 border-b border-primary/5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent/60" />
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
                {formattedProducts.length} Piezas disponibles
              </p>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ordenar por</span>
               <select className="bg-transparent text-[11px] font-black uppercase tracking-widest border-none focus:ring-0 cursor-pointer text-primary">
                <option>Novedades</option>
                <option>Precio: Mayor a Menor</option>
                <option>Precio: Menor a Mayor</option>
              </select>
            </div>
          </div>

          {formattedProducts.length === 0 ? (
            <div className="py-32 text-center bg-muted/20 rounded-[3rem] border border-dashed border-primary/10">
              <Moon className="h-8 w-8 text-primary/10 mx-auto mb-6" />
              <h3 className="text-2xl font-serif italic text-primary/40">Silencio en el catálogo...</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-black mt-2">Prueba quitando algunos filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
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
