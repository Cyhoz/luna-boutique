import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, Truck, ShieldCheck, Ruler, Share2, Heart, Sparkles, Moon, Stars } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AddToCartButton } from './AddToCartButton'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/product/ProductCard'
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
    .from('producto')
    .select('nombre, descripcion, imagen_producto(url_imagen)')
    .eq('id_producto', id)
    .single()

  if (!product) return { title: 'Producto no encontrado' }

  const imageUrl = product.imagen_producto?.[0]?.url_imagen || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200'

  return {
    title: `${product.nombre} | LUNA BOUTIQUE`,
    description: product.descripcion,
    openGraph: {
      title: `${product.nombre} | LUNA BOUTIQUE`,
      description: product.descripcion || undefined,
      images: [imageUrl],
    },
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Buscar el producto en la base de datos con relaciones completas
  const { data: product } = await supabase
    .from('producto')
    .select(`
      id_producto,
      nombre,
      descripcion,
      material,
      marca,
      categoria (id_categoria, nombre),
      variante_producto (
        id_variante,
        talla,
        precio,
        precio_descuento,
        color (id_color, nombre, codigo_hex),
        inventario (stock_actual)
      ),
      imagen_producto (url_imagen, es_principal, orden)
    `)
    .eq('id_producto', id)
    .single()

  if (!product) return notFound()

  // Buscar productos relacionados (misma categoría)
  const categoryId = (product as any).categoria?.id_categoria
  
  const { data: relatedProducts } = await supabase
    .from('producto')
    .select(`
      id_producto,
      nombre,
      categoria (nombre),
      variante_producto (
        id_variante,
        precio,
        precio_descuento,
        color (nombre),
        inventario (stock_actual)
      ),
      imagen_producto (url_imagen, es_principal)
    `)
    .eq('estado', 'activo')
    .eq('id_categoria', categoryId)
    .neq('id_producto', id)
    .limit(4)

  const variants = product.variante_producto || []
  const images = product.imagen_producto?.sort((a: any, b: any) => a.orden - b.orden) || []
  const mainImage = images.find((img: any) => img.es_principal)?.url_imagen || images[0]?.url_imagen || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200'
  
  const availableSizes = Array.from(new Set(variants.map((v: any) => v.talla))).filter(Boolean) as string[]
  
  // Extraer colores únicos como objetos
  const colorMap = new Map();
  variants.forEach((v: any) => {
    if (v.color) {
      colorMap.set(v.color.nombre, v.color);
    }
  });
  const availableColors = Array.from(colorMap.values());

  const defaultVariant = variants[0] || {}
  const currentPrice = defaultVariant.precio_descuento && defaultVariant.precio_descuento > 0 
    ? defaultVariant.precio_descuento 
    : defaultVariant.precio || 0
  const hasSale = defaultVariant.precio_descuento && defaultVariant.precio_descuento > 0
  
  const getStock = (v: any) => {
    if (!v?.inventario) return 0
    return Array.isArray(v.inventario) ? (v.inventario[0]?.stock_actual || 0) : (v.inventario.stock_actual || 0)
  }

  return (
    <div className="flex flex-col min-h-screen lunar-gradient relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3b0764]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Breadcrumbs Luxury */}
        <nav className="mb-16 flex items-center gap-4 text-[10px] font-sans font-black uppercase tracking-[0.4em] text-zinc-500">
          <Link href="/" className="hover:text-[#eab308] transition-colors">Inicio</Link>
          <Stars className="h-3 w-3 opacity-30" />
          <Link href="/coleccion" className="hover:text-[#eab308] transition-colors">Colección</Link>
          <Stars className="h-3 w-3 opacity-30" />
          <span className="text-white truncate">{product.nombre}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-20 lg:gap-32">
          {/* Gallery - Cinematic */}
          <div className="lg:col-span-7 space-y-10">
            <div className="glass rounded-[4rem] relative aspect-[4/5] w-full overflow-hidden group border-white/5">
              <Image
                src={mainImage}
                alt={product.nombre}
                fill
                className="object-cover object-center transition-transform duration-[2000ms] group-hover:scale-110 brightness-[0.85]"
                priority
              />
              
              <div className="absolute top-10 right-10 flex flex-col gap-6">
                <WishlistButton productId={product.id_producto} />
                <button className="p-5 glass-light rounded-full shadow-2xl hover:bg-white/10 transition-all hover:scale-110 border-white/10">
                  <Share2 className="h-5 w-5 text-white" />
                </button>
              </div>
              
              {hasSale && (
                <div className="absolute top-10 left-10">
                   <span className="rounded-full bg-[#db2777] px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-2xl pink-glow">
                    Limited Selection
                  </span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-8">
              {images.map((img: any, i: number) => (
                <div key={i} className={`glass relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-700 hover:scale-105 border-white/5 ${i === 0 ? 'ring-1 ring-[#eab308] shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'opacity-40 hover:opacity-100'}`}>
                  <Image src={img.url_imagen} alt={`${product.nombre} ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info - High End */}
          <div className="lg:col-span-5 flex flex-col pt-6">
            <div className="space-y-10 mb-16">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-[#eab308] animate-twinkle" />
                  <span className="text-[11px] font-sans font-black tracking-[0.5em] text-[#db2777] uppercase">
                    {(product.categoria as any)?.nombre || 'Exclusive Piece'}
                  </span>
                </div>
                
                <h1 className="text-6xl sm:text-8xl font-serif font-medium text-white leading-none tracking-tighter">
                  {product.nombre}
                </h1>
                
                <div className="flex items-baseline gap-8 mt-4">
                  <span className="text-5xl font-serif gold-text">
                    ${Number(currentPrice).toLocaleString()}
                  </span>
                  {hasSale && (
                    <span className="text-xl text-zinc-600 line-through font-light italic">
                      ${Number(defaultVariant.precio).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-xl text-zinc-400 leading-relaxed font-light">
                  {product.descripcion || 'Una pieza maestra diseñada para la elegancia atemporal. Confeccionada con los tejidos más finos para asegurar una caída perfecta.'}
                </p>
                <div className="flex gap-10 pt-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Material</p>
                    <p className="text-sm text-zinc-300 font-medium">{product.material || 'Lino de Seda'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Origen</p>
                    <p className="text-sm text-zinc-300 font-medium">Italia</p>
                  </div>
                </div>
              </div>

              <AddToCartButton 
                product={{
                  id: product.id_producto,
                  name: product.nombre,
                  price: Number(currentPrice),
                  imageUrl: mainImage,
                }}
                variants={variants}
                sizes={availableSizes}
                colors={availableColors}
              />
            </div>

            {/* Premium Trust - Ethereal Style */}
            <div className="mt-auto space-y-10 pt-16 border-t border-white/5">
              <div className="flex items-center gap-8 group">
                <div className="w-16 h-16 flex items-center justify-center glass rounded-3xl group-hover:border-[#eab308]/40 transition-all">
                  <Truck className="h-6 w-6 text-[#eab308]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Entrega Boutique</h4>
                  <p className="text-xs text-zinc-500 mt-2 font-medium">Empaque premium con aromas de luna. Envío estelar gratuito.</p>
                </div>
              </div>
              <div className="flex items-center gap-8 group">
                <div className="w-16 h-16 flex items-center justify-center glass rounded-3xl group-hover:border-[#db2777]/40 transition-all">
                  <ShieldCheck className="h-6 w-6 text-[#db2777]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Certificado de Calidad</h4>
                  <p className="text-xs text-zinc-500 mt-2 font-medium">Cada pieza es inspeccionada bajo los más altos estándares.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-48">
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-48 pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-24 text-center md:text-left">
            <div className="space-y-6">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <Moon className="h-4 w-4 text-[#eab308]" />
                <span className="text-[10px] font-black tracking-[0.6em] text-zinc-500 uppercase">El Próximo Destello</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-serif font-medium text-white tracking-tighter leading-none">Completa el <span className="gold-text italic">Look.</span></h2>
            </div>
            <Link href="/coleccion" className="text-[11px] font-black uppercase tracking-[0.3em] text-[#eab308] hover:text-[#db2777] transition-all pb-3 border-b border-white/5">Ver toda la colección</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
            {relatedProducts && relatedProducts.length > 0 ? (
              relatedProducts.map((rp: any) => {
                const mainImg = rp.imagen_producto?.find((img: any) => img.es_principal)?.url_imagen || rp.imagen_producto?.[0]?.url_imagen || mainImage;
                const v = rp.variante_producto?.[0] || {};
                return (
                  <ProductCard 
                    key={rp.id_producto}
                    id={rp.id_producto}
                    name={rp.nombre}
                    price={v.precio_descuento && v.precio_descuento > 0 ? v.precio_descuento : v.precio || 0}
                    originalPrice={v.precio}
                    category={(rp.categoria as any)?.nombre || 'COLECCIÓN'}
                    imageUrl={mainImg}
                    stock={getStock(v)}
                  />
                )
              })
            ) : (
              [1,2,3,4].map(i => (
                <div key={i} className="animate-pulse glass aspect-[4/5] rounded-[3rem] border-white/5" />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
