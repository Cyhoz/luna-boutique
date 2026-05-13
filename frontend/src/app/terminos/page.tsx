export default function TermsPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold font-display uppercase tracking-tight mb-12">Términos de Servicio</h1>
        
        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-zinc-900 dark:text-white font-bold uppercase tracking-widest text-[10px] mb-4">01. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar el sitio web de Antigravity (www.antigravity.cl), usted acepta estar sujeto a estos 
              Términos de Servicio y a todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de 
              estos términos, tiene prohibido utilizar o acceder a este sitio.
            </p>
          </section>

          <section>
            <h2 className="text-zinc-900 dark:text-white font-bold uppercase tracking-widest text-[10px] mb-4">02. Uso de la Licencia</h2>
            <p>
              Se concede permiso para descargar temporalmente una copia de los materiales (información o software) 
              en el sitio web de Antigravity para visualización transitoria personal y no comercial solamente.
            </p>
          </section>

          <section>
            <h2 className="text-zinc-900 dark:text-white font-bold uppercase tracking-widest text-[10px] mb-4">03. Propiedad Intelectual</h2>
            <p>
              Todo el contenido incluido en este sitio, como texto, gráficos, logotipos, iconos de botones, imágenes y clips de audio, 
              es propiedad de Antigravity o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual internacionales.
            </p>
          </section>

          <p className="pt-12 text-[10px] font-bold">Última actualización: 1 de Mayo, 2026</p>
        </div>
      </div>
    </div>
  )
}
