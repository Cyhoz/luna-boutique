import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star, Moon, Sparkles, ShieldCheck } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Obtener productos reales de Supabase
  const { data: dbProducts } = await supabase
    .from('products')
    .select(`
      id, name, base_price, is_new, is_on_sale, sale_price,
      product_variants (id, image_url)
    `)
    .limit(4)

  const featuredProducts = dbProducts?.map(p => ({
    id: p.id,
    name: p.name,
    price: p.sale_price || p.base_price,
    originalPrice: p.base_price,
    imageUrl: p.product_variants?.[0]?.image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000',
    category: 'Curated',
    isNew: p.is_new,
    isOnSale: p.is_on_sale
  })) || []

  return (
    <div className="flex flex-col gap-y-24 pb-24">
      {/* HERO SECTION - Sophisticated & Ethereal */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
          alt="Luna Boutique Hero"
          fill
          priority
          className="object-cover object-center brightness-[0.85] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40" />
        
        <div className="container relative z-10 mx-auto flex h-full flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-8">
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-primary/40" />
              <span className="text-[11px] font-sans font-black uppercase tracking-[0.4em] text-primary/60">
                Estilo Atemporal
              </span>
            </div>
            
            <h1 className="text-6xl font-serif font-medium leading-[1.1] tracking-tight text-primary sm:text-8xl md:text-9xl">
              La Esencia <br />
              <span className="italic">de la Luna.</span>
            </h1>
            
            <p className="max-w-xl text-lg font-medium text-primary/70 leading-relaxed">
              Curaduría exclusiva de moda unisex diseñada para elevar lo cotidiano a lo extraordinario. 
              Minimalismo refinado para el hombre y la mujer contemporáneos.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/coleccion"
                className="premium-button group flex h-16 items-center justify-center gap-3 rounded-full bg-primary px-10 text-[11px] font-black uppercase tracking-[0.2em] text-primary-foreground shadow-2xl transition-all"
              >
                Explorar Colección
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/novedades"
                className="flex h-16 items-center justify-center rounded-full border border-primary/10 bg-white/40 px-10 text-[11px] font-black uppercase tracking-[0.2em] text-primary backdrop-blur-md transition-all hover:bg-white/60"
              >
                Nuevas Entradas
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-12 right-12 hidden lg:block">
          <div className="flex items-center gap-4 text-primary/20">
            <Moon className="h-12 w-12" />
            <span className="h-px w-32 bg-primary/20" />
          </div>
        </div>
      </section>

      {/* FEATURED SECTION */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <Sparkles className="h-6 w-6 text-accent mb-4" />
          <h2 className="text-4xl font-serif font-medium text-primary uppercase tracking-tight sm:text-6xl">
            Piezas Maestras
          </h2>
          <p className="mt-4 text-muted-foreground font-medium uppercase tracking-[0.1em] text-xs">
            Selección exclusiva de nuestra última cápsula
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* EDITORIAL SECTION */}
      <section className="relative py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[3rem] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop"
                alt="Luna Boutique Editorial"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-10">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Nuestra Filosofía</span>
              <h2 className="text-5xl font-serif font-medium leading-tight text-primary sm:text-7xl">
                Moda que <br />
                <span className="italic text-accent">Trasciende.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Luna Boutique no es solo una tienda; es un santuario de estilo. Seleccionamos cada prenda 
                basándonos en su capacidad para contar una historia de elegancia discreta y calidad inigualable.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div>
                  <h4 className="font-serif text-2xl mb-2 italic">Unisex</h4>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Cortes Atemporales</p>
                </div>
                <div>
                  <h4 className="font-serif text-2xl mb-2 italic">Premium</h4>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Calidad Suprema</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER LUNA */}
      <section className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[4rem] bg-primary px-8 py-24 text-center shadow-3xl">
          <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #f8fafc 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <h2 className="text-5xl font-serif font-medium text-primary-foreground sm:text-7xl italic leading-tight">
              Únete al Círculo <br /> Luna.
            </h2>
            <p className="text-primary-foreground/60 font-medium">
              Recibe noticias sobre lanzamientos exclusivos, eventos privados y preventas anticipadas.
            </p>
            
            <form className="flex flex-col gap-4 sm:flex-row sm:items-center max-w-xl mx-auto">
              <input
                type="email"
                placeholder="CORREO@ELECTRONICO.COM"
                className="h-16 flex-1 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-8 text-xs font-bold uppercase tracking-widest text-primary-foreground outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-primary-foreground/30"
                required
              />
              <button
                type="submit"
                className="h-16 px-12 rounded-full bg-primary-foreground text-primary font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform"
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
