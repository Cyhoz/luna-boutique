export default function SustainabilityPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-4 block">Responsabilidad</span>
        <h1 className="text-4xl md:text-6xl font-bold font-display uppercase tracking-tight mb-12">Sostenibilidad<br />Consciente</h1>
        
        <div className="space-y-20">
          <section>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed mb-8">
              En Antigravity, creemos que el futuro del streetwear debe ser duradero. La verdadera sostenibilidad 
              comienza con la calidad: crear piezas que no necesiten ser reemplazadas cada temporada.
            </p>
            <div className="aspect-video relative rounded-[3rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-12">
              <img 
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200" 
                alt="Materials" 
                className="object-cover w-full h-full opacity-80"
              />
            </div>
          </section>

          <div className="grid gap-12">
            <div>
              <h2 className="text-2xl font-bold font-display uppercase tracking-tight mb-4">01. Producción Ética</h2>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Trabajamos exclusivamente con talleres locales que garantizan salarios justos y condiciones de 
                trabajo seguras. Visitamos nuestras plantas mensualmente para asegurar que nuestros estándares 
                se mantengan intactos.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display uppercase tracking-tight mb-4">02. Materiales de Bajo Impacto</h2>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Nuestros empaques son 100% compostables. Estamos en transición hacia el uso de poliéster 
                reciclado y algodones orgánicos certificados en el 80% de nuestra colección técnica.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display uppercase tracking-tight mb-4">03. El Ciclo Infinito</h2>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Ofrecemos un programa de reparación gratuita para todas nuestras prendas. Si tu pieza se daña, 
                la reparamos para que siga desafiando la gravedad contigo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
