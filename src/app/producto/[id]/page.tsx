import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, Truck, ShieldCheck, Ruler, Share2, Heart, Sparkles, Moon } from 'lucide-react'
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

  const imageUrl = product.product_variants?.[0]?.image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200'

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | LUNA BOUTIQUE`,
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
      id, name, description, base_price, is_new, is_on_sale, sale_price,
      categories (id, name),
      product_variants (id, size, color, stock_quantity, image_url, price_adjustment)
    `)
    .eq('id', id)
    .single()

  if (!product) return notFound()

  // Buscar productos relacionados (misma categoría)
  const categoryId = (product as any).categories?.id || (product as any).category_id
  
  const { data: relatedProducts } = await supabase
    .from('products')
    .select(`
      id, name, base_price, is_new, is_on_sale, sale_price,
      categories (name),
      product_variants (id, image_url)
    `)
    .eq('is_active', true)
    .neq('id', id)
    .limit(4)

  const variants = product.product_variants || []
  const defaultVariant = variants[0] || {}
  const mainImage = defaultVariant.image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200'
  
  const availableSizes = Array.from(new Set(variants.map((v: any) => v.size))).filter(Boolean) as string[]
  const availableColors = Array.from(new Set(variants.map((v: any) => v.color))).filter(Boolean) as string[]

  const currentPrice = product.is_on_sale && product.sale_price ? product.sale_price : product.base_price
  const hasSale = product.is_on_sale && product.sale_price

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-7xl">
        {/* Breadcrumbs Refined */}
        <nav className="mb-12 flex items-center gap-3 text-[10px] font-sans font-black uppercase tracking-[0.3em] text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <span className="opacity-20">/</span>
          <Link href="/coleccion" className="hover:text-primary transition-colors">Colección</Link>
          <span className="opacity-20">/</span>
          <span className="text-primary truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Gallery - Sophisticated */}
          <div className="lg:col-span-7 space-y-8">
            <div className="lunar-glow relative aspect-[4/5] w-full bg-muted rounded-[3rem] overflow-hidden group">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              <div className="absolute top-8 right-8 flex flex-col gap-4">
                <WishlistButton productId={product.id} />
                <button className="p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md rounded-full shadow-xl hover:bg-white dark:hover:bg-zinc-950 transition-all hover:scale-110">
                  <Share2 className="h-5 w-5 text-primary" />
                </button>
              </div>
              
              {(product.is_new || hasSale) && (
                <div className="absolute top-8 left-8">
                   <span className="rounded-full bg-primary/90 backdrop-blur-md px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground shadow-2xl">
                    {product.is_new ? 'NEW DROP' : 'LIMITED EDITION'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              {[mainImage, mainImage, mainImage, mainImage].map((img, i) => (
                <div key={i} className={`relative aspect-square rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 ${i === 0 ? 'ring-2 ring-accent ring-offset-4 ring-offset-background' : 'opacity-60 hover:opacity-100'}`}>
                  <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info - Elegant */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-[11px] font-sans font-black tracking-[0.4em] text-accent uppercase">
                  {(product.categories as any)?.name || 'Curated Fashion'}
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-7xl font-serif font-medium text-primary leading-[1.1] tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-6">
                <span className="text-4xl font-serif text-primary">
                  ${Number(currentPrice).toLocaleString()}
                </span>
                {hasSale && (
                  <span className="text-lg text-muted-foreground line-through opacity-50">
                    ${Number(product.base_price).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <div className="prose prose-zinc dark:prose-invert mb-12">
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                {product.description || 'Una pieza maestra diseñada para la elegancia atemporal. Confeccionada con los tejidos más finos para asegurar una caída perfecta y una comodidad excepcional.'}
              </p>
            </div>

            <AddToCartButton 
              product={{
                id: product.id,
                name: product.name,
                price: Number(currentPrice),
                imageUrl: mainImage,
              }}
              variants={variants}
              sizes={availableSizes}
              colors={availableColors}
            />

            <button className="mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
              <Ruler className="h-4 w-4" /> Consultar Guía de Tallas
            </button>

            {/* Premium Trust Badges */}
            <div className="mt-16 space-y-8 pt-12 border-t border-zinc-100 dark:border-zinc-800/50">
              <div className="flex items-start gap-6 group">
                <div className="p-4 bg-muted rounded-2xl group-hover:bg-accent/10 transition-colors">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-[11px] font-sans font-black uppercase tracking-widest text-primary">Envío Boutique</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">Cuidado especial en cada paquete. Entrega asegurada en 2-5 días hábiles.</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="p-4 bg-muted rounded-2xl group-hover:bg-accent/10 transition-colors">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-[11px] font-sans font-black uppercase tracking-widest text-primary">Garantía Luna</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">Calidad certificada. 30 días de satisfacción total o devolución garantizada.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION - Redesigned */}
        <div className="mt-40">
           <ProductReviews productId={product.id} />
        </div>

        {/* RELATED PRODUCTS - Editorial Feel */}
        <div className="mt-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Moon className="h-4 w-4 text-accent" />
                <span className="text-[10px] font-black tracking-[0.5em] text-muted-foreground uppercase">Explora más</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-medium text-primary leading-tight">Completa el <span className="italic text-accent">Look.</span></h2>
            </div>
            <Link href="/coleccion" className="text-[11px] font-black uppercase tracking-[0.3em] text-primary hover:text-accent transition-colors pb-2 border-b border-primary/10">Ver toda la colección</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {relatedProducts && relatedProducts.length > 0 ? (
              relatedProducts.map((rp: any) => (
                <ProductCard 
                  key={rp.id}
                  id={rp.id}
                  name={rp.name}
                  price={rp.sale_price || rp.base_price}
                  originalPrice={rp.base_price}
                  category={(rp.categories as any)?.name || 'COLECCIÓN'}
                  imageUrl={rp.product_variants?.[0]?.image_url || mainImage}
                  isNew={rp.is_new}
                  isOnSale={rp.is_on_sale}
                />
              ))
            ) : (
              [1,2,3,4].map(i => (
                <div key={i} className="animate-pulse bg-muted aspect-[4/5] rounded-[2.5rem]" />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
