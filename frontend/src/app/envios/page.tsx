import { Truck, Globe, ShieldCheck } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold font-display uppercase tracking-tight mb-4">Envíos y Entregas</h1>
        <p className="text-zinc-500 font-medium mb-16">Logística de precisión para tu equipo técnico.</p>

        <div className="grid gap-8">
          <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-xl">
                <Truck className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight">Nacional (Chile)</h2>
            </div>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span>Santiago Express (24h)</span>
                <span className="font-bold text-zinc-900 dark:text-white">$3.500</span>
              </li>
              <li className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span>Regiones (3-5 días hábiles)</span>
                <span className="font-bold text-zinc-900 dark:text-white">$6.000</span>
              </li>
              <li className="flex justify-between font-bold text-amber-500 pt-2">
                <span>Compras sobre $150.000</span>
                <span>GRATIS</span>
              </li>
            </ul>
          </div>

          <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-xl">
                <Globe className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight">Internacional</h2>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              Realizamos envíos a todo el mundo a través de DHL Express. Los tiempos de tránsito suelen ser de 
              5 a 10 días hábiles dependiendo de la zona.
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              *Aranceles e impuestos de importación son responsabilidad del cliente.
            </p>
          </div>

          <div className="p-8 bg-zinc-950 text-white rounded-3xl shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <ShieldCheck className="h-6 w-6 text-amber-500" />
              <h2 className="text-xl font-bold font-display uppercase tracking-tight">Garantía de Entrega</h2>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Todos nuestros pedidos están asegurados. Si tu paquete se pierde o llega dañado, 
              nos hacemos responsables de la reposición inmediata.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
