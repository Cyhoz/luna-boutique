import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, Truck, ShieldAlert, Ruler, Share2, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AddToCartButton } from './AddToCartButton'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductReviews } from '@/components/product/ProductReviews'
import { WishlistButton } from './WishlistButton'

import { Metadata, ResolvingMetadata } from 'next'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('name, description, product_variants(image_url)')
    .eq('id', id)
    .single()

  if (!product) return { title: 'Producto no encontrado' }

  const imageUrl = product.product_variants?.[0]?.image_url || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200'

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | ANTIGRAVITY`,
      description: product.description || undefined,
      images: [imageUrl],
    },
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Buscar el producto en la base de datos
  const { data: product } = await supabase
    .from('products')
    .select(`
      id, name, description, base_price,
      categories (id, name),
      product_variants (id, size, color, stock_quantity, image_url, price_adjustment)
    `)
    .eq('id', id)
    .single()

  // Buscar productos relacionados (misma categoría)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select(`
      id, name, base_price,
      categories (name),
      product_variants (id, image_url)
    `)
    .eq('category_id', product?.categories?.id)
    .neq('id', id)
    .limit(4)

  const p = product || {
    id,
    name: 'Oversized Heavyweight Hoodie',
    description: 'Nuestra sudadera insignia. Cortada de algodón de rizo francés de 450 GSM de alto gramaje con un ajuste holgado y hombros caídos. Pre-encogida y tratada para un acabado ultra suave. Perfecta para cualquier temporada.',
    base_price: 89.99,
    categories: { name: 'SUDADERAS' },
    product_variants: [
      { id: 'v1', size: 'S', color: 'Onyx', stock_quantity: 5, image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200' },
      { id: 'v2', size: 'M', color: 'Onyx', stock_quantity: 10, image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200' },
      { id: 'v3', size: 'L', color: 'Onyx', stock_quantity: 0, image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200' },
    ]
  }

  if (!p) return notFound()

  const variants = p.product_variants || []
  const defaultVariant = variants[0] || {}
  const mainImage = defaultVariant.image_url || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200'
  
  const availableSizes = Array.from(new Set(variants.map((v: any) => v.size))).filter(Boolean) as string[]
  const availableColors = Array.from(new Set(variants.map((v: any) => v.color))).filter(Boolean) as string[]

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/coleccion" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Colección</Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-white">{p.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Gallery - Col 7 */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="relative aspect-[4/5] w-full bg-zinc-100 dark:bg-zinc-900 rounded-3xl overflow-hidden group">
              <Image
                src={mainImage}
                alt={p.name}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                priority
              />
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <WishlistButton productId={p.id} />
                <button className="p-3 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white dark:hover:bg-zinc-950 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Thumbnails (Simulated) */}
            <div className="grid grid-cols-4 gap-4">
              {[mainImage, mainImage, mainImage, mainImage].map((img, i) => (
                <div key={i} className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 ${i === 0 ? 'border-amber-500' : 'border-transparent'}`}>
                  <Image src={img} alt={`${p.name} ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info - Col 5 */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold tracking-[0.3em] text-amber-500 uppercase">
                {p.categories?.name || 'NUEVA TEMPORADA'}
              </span>
            </div>
            
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white tracking-tighter font-display uppercase">
              {p.name}
            </h1>
            
            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-3xl font-medium text-zinc-900 dark:text-white">
                ${p.base_price.toFixed(2)}
              </span>
              <span className="text-sm text-zinc-500 line-through">
                ${(p.base_price * 1.2).toFixed(2)}
              </span>
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded">
                Save 20%
              </span>
            </div>

            <div className="mt-8 mb-8">
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                {p.description || 'Una prenda esencial para tu armario, diseñada con precisión y confeccionada con los mejores materiales.'}
              </p>
            </div>

            <AddToCartButton 
              product={{
                id: p.id,
                name: p.name,
                price: p.base_price,
                imageUrl: mainImage,
              }}
              variants={variants}
              sizes={availableSizes}
              colors={availableColors}
            />

            {/* Size Guide Trigger */}
            <button className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors">
              <Ruler className="h-4 w-4" /> Guía de tallas y medidas
            </button>

            {/* Trust Badges */}
            <div className="mt-12 space-y-6 pt-10 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
                  <Truck className="h-6 w-6 text-zinc-900 dark:text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest">Envío Express</h4>
                  <p className="text-xs text-zinc-500 mt-1">Gratis en pedidos superiores a $150. Entrega en 2-4 días hábiles.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
                  <ShieldAlert className="h-6 w-6 text-zinc-900 dark:text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest">Garantía Antigravity</h4>
                  <p className="text-xs text-zinc-500 mt-1">Materiales técnicos de alta resistencia. 30 días de devolución asegurada.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <ProductReviews productId={p.id} />

        {/* RELATED PRODUCTS */}
        <div className="mt-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[10px] font-bold tracking-[0.4em] text-zinc-400 uppercase">Completa el look</span>
              <h2 className="text-3xl font-bold tracking-tighter mt-2 font-display">PRODUCTOS RELACIONADOS</h2>
            </div>
            <Link href="/coleccion" className="text-xs font-bold uppercase tracking-widest hover:underline">Ver todo</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts && relatedProducts.length > 0 ? (
              relatedProducts.map((rp: any) => (
                <ProductCard 
                  key={rp.id}
                  id={rp.id}
                  name={rp.name}
                  price={rp.base_price}
                  category={rp.categories?.name || 'COLECCIÓN'}
                  imageUrl={rp.product_variants?.[0]?.image_url || mainImage}
                />
              ))
            ) : (
              // Empty state related products
              [1,2,3,4].map(i => (
                <div key={i} className="animate-pulse bg-zinc-100 dark:bg-zinc-900 aspect-[4/5] rounded-3xl" />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
