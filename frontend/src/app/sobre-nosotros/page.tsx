import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000" 
          alt="Antigravity Studio" 
          fill 
          className="object-cover opacity-60 grayscale"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-8xl font-black font-display uppercase tracking-tighter text-zinc-900 dark:text-white">
            Nuestra<br />Filosofía
          </h1>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.4em] text-amber-500">
            Elevando lo Esencial desde 2026
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-32 max-w-4xl">
        <div className="space-y-16">
          <div>
            <h2 className="text-3xl font-bold font-display uppercase tracking-tight mb-8">La Historia Técnica</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Antigravity nació en la intersección de la arquitectura y el streetwear. Nuestra misión es simple pero radical: 
              crear prendas que desafíen las convenciones de peso, forma y utilidad. Cada pieza es una declaración de 
              ingeniería textil, diseñada para el explorador urbano que valora la función tanto como la forma.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-amber-500">Diseño</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Nuestros cortes son el resultado de meses de prototipado. Buscamos la silueta perfecta que permita 
                movimiento sin restricciones, inspirándonos en la ergonomía aeroespacial.
              </p>
            </div>
            <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-amber-500">Calidad</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Solo utilizamos algodones de 400 GSM+, tejidos técnicos hidrofóbicos y herrajes metálicos de grado 
                industrial. Antigravity no es moda rápida; es equipo para la vida.
              </p>
            </div>
          </div>

          <div className="pt-16 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-center italic text-zinc-400 font-medium">
              "No estamos diseñando ropa. Estamos diseñando el uniforme de una generación que no se detiene."
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
