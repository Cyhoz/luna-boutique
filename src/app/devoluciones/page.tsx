import { RefreshCcw, ShieldCheck, AlertCircle } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold font-display uppercase tracking-tight mb-4">Cambios y Devoluciones</h1>
        <p className="text-zinc-500 font-medium mb-16">Satisfacción garantizada o te devolvemos tu dinero.</p>

        <div className="space-y-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCcw className="h-6 w-6 text-zinc-900 dark:text-white" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-tight mb-2">30 Días</h3>
              <p className="text-xs text-zinc-500">Para cualquier cambio o devolución.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-6 w-6 text-zinc-900 dark:text-white" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-tight mb-2">Gratis</h3>
              <p className="text-xs text-zinc-500">Primer cambio de talla sin costo.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-6 w-6 text-zinc-900 dark:text-white" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-tight mb-2">Original</h3>
              <p className="text-xs text-zinc-500">Prendas con etiquetas y sin uso.</p>
            </div>
          </div>

          <section className="bg-zinc-50 dark:bg-zinc-900/50 p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800">
            <h2 className="text-2xl font-bold font-display uppercase tracking-tight mb-6">Proceso de Retorno</h2>
            <ol className="space-y-8">
              <li className="flex gap-6">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">1</span>
                <div>
                  <p className="font-bold text-sm uppercase tracking-widest mb-1">Solicitud</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">Envía un correo a <span className="text-zinc-900 dark:text-white font-bold">returns@antigravity.cl</span> con tu número de orden.</p>
                </div>
              </li>
              <li className="flex gap-6">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">2</span>
                <div>
                  <p className="font-bold text-sm uppercase tracking-widest mb-1">Empaque</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">Prepara el paquete con el embalaje original para asegurar que la prenda no sufra daños.</p>
                </div>
              </li>
              <li className="flex gap-6">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">3</span>
                <div>
                  <p className="font-bold text-sm uppercase tracking-widest mb-1">Retiro/Envío</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">Te enviaremos una etiqueta de retorno o programaremos un retiro a tu domicilio.</p>
                </div>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  )
}
