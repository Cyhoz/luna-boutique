import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product/ProductCard'
import { FilterSidebar } from './FilterSidebar'
import { SortSelector } from './SortSelector'
import { Suspense } from 'react'
import { Moon, Sparkles, Stars } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Colección Curada',
  description: 'Explora nuestra selección exclusiva de alta costura y diseños atemporales en LUNA BOUTIQUE.',
}

export default async function ColeccionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const categoriaNombre = params.categoria as string
  const stockOnly = params.stock === 'true'
  const maxPrice = params.precio ? parseInt(params.precio as string) : null
  const orden = params.orden as string

  const supabase = await createClient()

  // Consulta adaptada al nuevo esquema del MER (Español)
  let query = supabase
    .from('producto')
    .select(`
      id_producto,
      nombre,
      estado,
      categoria!inner (id_categoria, nombre),
      variante_producto (
        id_variante,
        talla,
        precio,
        precio_descuento,
        inventario (stock_actual)
      ),
      imagen_producto (url_imagen, es_principal)
    `)
    .eq('estado', 'activo')

  if (categoriaNombre) {
    query = query.eq('categoria.nombre', categoriaNombre)
  }

  if (maxPrice) {
    query = query.lte('precio', maxPrice)
  }

  // Lógica de ordenamiento
  if (orden === 'high') {
    query = query.order('precio', { ascending: false })
  } else if (orden === 'low') {
    query = query.order('precio', { ascending: true })
  } else {
    query = query.order('fecha_creacion', { ascending: false })
  }

  const { data: dbProducts } = await query

  let formattedProducts = dbProducts?.map((p: any) => {
    const mainImage = p.imagen_producto?.find((img: any) => img.es_principal)?.url_imagen 
      || p.imagen_producto?.[0]?.url_imagen 
      || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800';

    const firstVariant = p.variante_producto?.[0] || { id_variante: '', precio: 0, precio_descuento: 0 }
    const totalStock = p.variante_producto?.reduce((acc: number, v: any) => 
      acc + (v.inventario?.stock_actual || 0), 0) || 0;

    return {
      id: firstVariant.id_variante, // Cambiado para enviar el UUID de la variante
      productId: p.id_producto,
      name: p.nombre,
      price: firstVariant.precio_descuento && firstVariant.precio_descuento > 0 ? firstVariant.precio_descuento : firstVariant.precio,
      originalPrice: firstVariant.precio,
      category: p.categoria?.nombre || 'COLECCIÓN',
      imageUrl: mainImage,
      isNew: true,
      isOnSale: firstVariant.precio_descuento && firstVariant.precio_descuento > 0,
      variants: p.variante_producto || [],
      stock: totalStock
    }
  }) || []

  if (stockOnly) {
    formattedProducts = formattedProducts.filter(p => p.stock > 0)
  }

  return (
    <div className="min-h-screen lunar-gradient relative">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3b0764]/20 blur-[120px] rounded-full animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#db2777]/10 blur-[100px] rounded-full animate-pulse-slow pointer-events-none" />

      <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header del Catálogo - Luna Boutique Style */}
        <div className="mb-24 text-center space-y-8">
          <div className="flex justify-center items-center gap-4">
            <Stars className="h-4 w-4 text-[#eab308] pink-glow" />
            <span className="text-[10px] font-sans font-black uppercase tracking-[0.6em] text-[#eab308]">The Curated Selection</span>
            <Stars className="h-4 w-4 text-[#eab308] pink-glow" />
          </div>
          <h1 className="text-6xl sm:text-9xl font-serif font-medium text-white italic leading-tight tracking-tighter">
            La <span className="gold-text">Colección.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Piezas atemporales que trascienden las tendencias. 
            Confección de alta gama diseñada para la elegancia eterna.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Sidebar de Filtros - Glassmorphism */}
          <Suspense fallback={<div className="w-64 animate-pulse bg-white/5 h-96 rounded-[3rem]"></div>}>
            <div className="lg:sticky lg:top-32 w-full lg:w-72">
              <FilterSidebar />
            </div>
          </Suspense>

          {/* Grilla de Productos */}
          <div className="flex-1 w-full">
            {/* Barra de utilidades top */}
            <div className="glass-light rounded-[2.5rem] px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-16 border-white/5">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-[#eab308]/80 animate-twinkle" />
                <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
                  {formattedProducts.length} Piezas Maestras
                </p>
              </div>
              <SortSelector currentSort={orden} />
            </div>

            {formattedProducts.length === 0 ? (
              <div className="py-40 text-center glass rounded-[4rem] border-white/5 border-dashed border-2">
                <Moon className="h-10 w-10 text-white/20 mx-auto mb-8 animate-float" />
                <h3 className="text-3xl font-serif italic text-white/50 mb-4">El firmamento está despejado...</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black">Prueba con otros filtros de búsqueda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-20">
                {formattedProducts.map((product) => (
                  <ProductCard key={product.productId || product.id} {...product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
