export default function CookiesPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold font-display uppercase tracking-tight mb-12">Política de Cookies</h1>
        
        <div className="space-y-8 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-zinc-900 dark:text-white font-bold uppercase tracking-widest text-[10px] mb-4">¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. 
              Nos ayudan a que el sitio web funcione correctamente y a mejorar su experiencia de usuario.
            </p>
          </section>

          <section>
            <h2 className="text-zinc-900 dark:text-white font-bold uppercase tracking-widest text-[10px] mb-4">Tipos de cookies que usamos</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-bold">Esenciales:</span> Necesarias para el funcionamiento del carrito y el inicio de sesión.</li>
              <li><span className="font-bold">Analíticas:</span> Nos ayudan a entender cómo los visitantes interactúan con el sitio.</li>
              <li><span className="font-bold">Preferencias:</span> Recuerdan sus ajustes como el idioma o la moneda.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-zinc-900 dark:text-white font-bold uppercase tracking-widest text-[10px] mb-4">Control de cookies</h2>
            <p>
              Usted puede controlar y/o eliminar las cookies según desee a través de la configuración de su navegador. 
              Sin embargo, si lo hace, es posible que algunas funciones de este sitio no funcionen correctamente.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
