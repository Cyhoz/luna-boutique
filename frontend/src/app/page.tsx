import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star, Moon, Sparkles, Stars, Zap } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Obtener productos destacados usando el nuevo esquema
  const { data: dbProducts } = await supabase
    .from('producto')
    .select(`
      id_producto,
      nombre,
      categoria (nombre),
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
    .limit(4)

  const featuredProducts = dbProducts?.map(p => {
    const mainImage = p.imagen_producto?.find((img: any) => img.es_principal)?.url_imagen 
      || p.imagen_producto?.[0]?.url_imagen 
      || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000';

    const firstVariant = p.variante_producto?.[0] || { id_variante: '', precio: 0, precio_descuento: 0 }
    const finalPrice = firstVariant.precio_descuento && firstVariant.precio_descuento > 0 
      ? firstVariant.precio_descuento 
      : firstVariant.precio

    // Calculamos el stock total sumando todas las variantes
    const totalStock = p.variante_producto?.reduce((acc: number, v: any) => {
      const vStock = Array.isArray(v.inventario) ? (v.inventario[0]?.stock_actual || 0) : (v.inventario?.stock_actual || 0)
      return acc + vStock
    }, 0) || 0

    return {
      id: firstVariant.id_variante,
      productId: p.id_producto,
      name: p.nombre,
      price: finalPrice,
      originalPrice: firstVariant.precio,
      imageUrl: mainImage,
      category: (p.categoria as any)?.nombre || 'EXCLUSIVO',
      isNew: true,
      isOnSale: firstVariant.precio_descuento && firstVariant.precio_descuento > 0,
      stock: totalStock,
      variants: p.variante_producto || []
    }
  }) || []

  return (
    <div className="flex flex-col gap-y-32 pb-32 relative isolate min-h-screen lunar-gradient overflow-hidden">
      
      {/* HERO SECTION - Minimalist Luxury */}
      <section className="relative h-screen w-full flex items-center justify-center pt-20">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center space-y-12">
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#f6ca56]/80" />
              <div className="flex items-center gap-2">
                <Stars className="h-4 w-4 text-[#f6ca56] animate-twinkle drop-shadow-[0_0_10px_rgba(246,202,86,1)]" />
                <span className="text-[10px] font-sans font-black uppercase tracking-[0.6em] text-[#f6ca56] drop-shadow-md">
                  Venta de Ropa & Confección
                </span>
              </div>
              <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#f6ca56]/80" />
            </div>
            
            <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200">
              <h1 className="text-8xl font-serif font-light leading-none tracking-tighter text-white sm:text-[12rem] md:text-[16rem] select-none opacity-90 drop-shadow-2xl">
                LUNA
              </h1>
              <span className="absolute -bottom-6 right-0 text-4xl font-serif italic text-[#e52b82] sm:text-7xl md:text-9xl drop-shadow-[0_0_15px_rgba(229,43,130,0.6)]">
                Boutique
              </span>
            </div>
            
            <p className="max-w-2xl text-xl font-light text-zinc-400 leading-relaxed pt-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500">
              Donde la esencia del cosmos se encuentra con la confección artesanal. 
              Piezas exclusivas diseñadas para quienes iluminan la oscuridad.
            </p>
            
            <div className="flex flex-col gap-6 sm:flex-row pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
              <Link
                href="/coleccion"
                className="group relative flex h-20 items-center justify-center gap-4 rounded-full bg-[#e52b82] px-12 text-[12px] font-black uppercase tracking-[0.3em] text-white shadow-[0_0_30px_rgba(229,43,130,0.6)] transition-all hover:scale-[1.05] hover:bg-[#d11a6f]"
              >
                Explorar la Colección
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Link>
              <Link
                href="/novedades"
                className="flex h-20 items-center justify-center rounded-full border border-[#f6ca56]/30 bg-white/5 px-12 text-[12px] font-black uppercase tracking-[0.3em] text-[#f6ca56] backdrop-blur-xl transition-all hover:bg-white/10 shadow-[0_0_20px_rgba(246,202,86,0.2)]"
              >
                Recién Llegados
              </Link>
            </div>
          </div>
        </div>

        {/* Ambient Moon Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#eab308]/5 rounded-full pointer-events-none opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#db2777]/5 rounded-full pointer-events-none opacity-20 animate-pulse-slow" />
      </section>

      {/* FEATURED SECTION */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-24 space-y-4">
          <div className="bg-[#f6ca56]/10 p-4 rounded-full mb-4 border border-[#f6ca56]/20">
            <Sparkles className="h-6 w-6 text-[#f6ca56] animate-twinkle" />
          </div>
          <h2 className="text-5xl font-serif font-light text-white uppercase tracking-tight sm:text-8xl drop-shadow-lg">
            Piezas <span className="gold-text italic">Maestras</span>
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#f6ca56] to-transparent mt-6 opacity-60" />
          <p className="mt-8 text-white/80 font-bold uppercase tracking-[0.4em] text-[10px]">
            La curaduría del mes
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-24 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.productId || product.id} {...product} />
          ))}
        </div>
      </section>

      {/* EDITORIAL SECTION - Luxury Focus */}
      <section className="relative py-40 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-24 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4rem] shadow-2xl border border-zinc-100 hover-lift">
              <Image
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop"
                alt="Luna Boutique Editorial"
                fill
                className="object-cover brightness-75 transition-transform duration-1000 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3b1a5a]/90 via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12 right-12">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#f6ca56] mb-4 block drop-shadow-md">
                Artesanía Lunar
              </span>
              <h3 className="text-4xl font-serif text-white drop-shadow-lg">El Proceso de Creación</h3>
            </div>
            </div>
            <div className="space-y-12">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-[#e52b82]/40 bg-[#e52b82]/10 backdrop-blur-md">
                <Zap className="h-4 w-4 text-[#e52b82]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white drop-shadow-md">Nuestra Filosofía</span>
              </div>
              <h2 className="text-6xl font-serif font-medium leading-tight text-white sm:text-8xl drop-shadow-lg">
                Elegancia que <br />
                <span className="text-[#f6ca56] drop-shadow-[0_0_10px_rgba(246,202,86,0.6)] italic">Trasciende.</span>
              </h2>
              <p className="text-xl text-white/90 font-light leading-relaxed max-w-xl">
                En Luna Boutique, cada prenda es una estrella en nuestra constelación. 
                Fusionamos la confección tradicional con visiones vanguardistas para crear 
                piezas que no solo se visten, sino que se sienten.
              </p>
              <div className="grid grid-cols-2 gap-10 pt-8">
                <div className="group p-8 rounded-[2.5rem] border border-[#f6ca56]/20 bg-black/20 backdrop-blur-md hover:border-[#f6ca56]/60 transition-all cursor-default shadow-[0_0_15px_rgba(246,202,86,0.1)]">
                  <h4 className="font-serif text-3xl mb-3 italic text-white group-hover:text-[#f6ca56] transition-colors">Artesanal</h4>
                  <p className="text-[9px] text-white/80 uppercase tracking-widest font-bold">Hecho a Mano</p>
                </div>
                <div className="group p-8 rounded-[2.5rem] border border-[#e52b82]/20 bg-black/20 backdrop-blur-md hover:border-[#e52b82]/60 transition-all cursor-default shadow-[0_0_15px_rgba(229,43,130,0.1)]">
                  <h4 className="font-serif text-3xl mb-3 italic text-white group-hover:text-[#e52b82] transition-colors">Premium</h4>
                  <p className="text-[9px] text-white/80 uppercase tracking-widest font-bold">Tejidos de Lujo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER LUNA - Celestial Call */}
      <section className="container mx-auto px-4 py-32 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[5rem] bg-black/30 backdrop-blur-xl p-12 sm:p-24 text-center shadow-[0_0_50px_rgba(229,43,130,0.2)] border border-[#e52b82]/20">
          <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <Stars className="h-10 w-10 text-[#eab308] mx-auto animate-twinkle" />
            <h2 className="text-4xl font-serif font-light text-white sm:text-6xl text-center drop-shadow-lg">
            Únete a la <span className="text-[#f6ca56] italic">Constelación</span>
          </h2>
          <p className="text-white/80 text-center uppercase tracking-widest text-[10px] max-w-xl mx-auto">
            Acceso exclusivo a nuevas colecciones, eventos privados y piezas de edición limitada.
          </p>
            
            <form className="flex flex-col gap-6 sm:flex-row sm:items-center max-w-2xl mx-auto pt-8">
              <input
                type="email"
                placeholder="TU@EMAIL_ESTELAR.COM"
                className="h-20 flex-1 rounded-full border border-white/10 bg-white/5 px-10 text-[11px] font-bold uppercase tracking-[0.3em] text-white outline-none focus:ring-2 focus:ring-[#db2777] transition-all placeholder:text-zinc-700"
                required
              />
              <button
                type="submit"
                className="h-20 px-16 rounded-full bg-[#f6ca56] text-[#3b1a5a] font-black uppercase tracking-[0.3em] text-[11px] hover:scale-[1.05] transition-all hover:bg-[#ffeeaa] shadow-[0_0_20px_rgba(246,202,86,0.4)]"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
