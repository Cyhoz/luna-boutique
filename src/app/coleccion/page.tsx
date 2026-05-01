import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product/ProductCard'
import { FilterSidebar } from './FilterSidebar'
import { Suspense } from 'react'

// Mock Data fallback
const mockProducts = [
  { id: '1', name: 'Oversized Heavyweight Hoodie', price: 89.99, category: 'SUDADERAS', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800', isNew: true },
  { id: '2', name: 'Tech Cargo Pants', price: 110.00, category: 'PANTALONES', imageUrl: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=800' },
  { id: '3', name: 'Minimalist Essential Tee', price: 35.00, category: 'CAMISETAS', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800', isNew: true },
  { id: '4', name: 'Puffer Jacket Onyx', price: 145.50, category: 'ABRIGOS', imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800' },
  { id: '5', name: 'Washed Denim Jacket', price: 120.00, category: 'ABRIGOS', imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800' },
  { id: '6', name: 'Heavy Cotton Mockneck', price: 55.00, category: 'SUDADERAS', imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800' }
]

export default async function ColeccionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const categoria = params.categoria as string

  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`
      id, name, base_price,
      categories (name),
      product_variants (id, image_url)
    `)
    .eq('is_active', true)

  // Si hay filtro de categoría, necesitamos hacer un join manual o filtrar en JS si no podemos hacer inner join fácil
  // Como 'categories' es un relation, podemos intentar:
  if (categoria) {
    // Para simplificar y no fallar en Supabase, traemos todos y filtramos en memoria, 
    // o hacemos un eq() en la relación si lo permite. Lo filtraremos en JS para asegurar estabilidad en la demo.
  }

  const { data: dbProducts } = await query

  let formattedProducts = []

  if (dbProducts && dbProducts.length > 0) {
    formattedProducts = dbProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.base_price,
      category: p.categories?.name || 'COLECCIÓN',
      imageUrl: p.product_variants?.[0]?.image_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800',
      isNew: false
    }))
  } else {
    formattedProducts = mockProducts
  }

  // Aplicar filtro de categoría en memoria (para los mock o DB simple)
  if (categoria) {
    formattedProducts = formattedProducts.filter(p => p.category.toUpperCase() === categoria.toUpperCase())
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header del Catálogo */}
      <div className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
          La Colección.
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Nuestra línea completa de prendas diseñadas para trascender temporadas. 
          Encuentra tu próximo esencial.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Sidebar de Filtros */}
        <Suspense fallback={<div className="w-64 animate-pulse bg-zinc-100 h-96 rounded-xl"></div>}>
          <FilterSidebar />
        </Suspense>

        {/* Grilla de Productos */}
        <div className="flex-1 w-full">
          {/* Barra de utilidades top (Ordenar, etc) */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-zinc-500 font-medium">
              Mostrando {formattedProducts.length} productos
            </p>
            <select className="bg-transparent text-sm font-medium border-none focus:ring-0 cursor-pointer dark:text-white dark:bg-zinc-950">
              <option>Novedades</option>
              <option>Precio: Mayor a Menor</option>
              <option>Precio: Menor a Mayor</option>
            </select>
          </div>

          {formattedProducts.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="text-xl font-bold mb-2">No se encontraron productos</h3>
              <p className="text-zinc-500">Prueba quitando el filtro de categoría.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
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
