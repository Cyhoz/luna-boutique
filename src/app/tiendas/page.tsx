import { MapPin, Clock, Phone } from 'lucide-react'

export default function StoresPage() {
  const stores = [
    {
      city: 'Santiago',
      neighborhood: 'Vitacura',
      address: 'Alonso de Córdova 3890, Piso 2',
      schedule: 'Lun - Sáb: 10:00 - 20:00',
      phone: '+56 2 2345 6789'
    },
    {
      city: 'Buenos Aires',
      neighborhood: 'Palermo Soho',
      address: 'El Salvador 4700',
      schedule: 'Mar - Dom: 11:00 - 19:00',
      phone: '+54 11 9876 5432'
    }
  ]

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-7xl font-bold font-display uppercase tracking-tight mb-4">Puntos de Venta</h1>
          <p className="text-zinc-500 uppercase text-[10px] font-black tracking-[0.4em]">Experiencias Inmersivas</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {stores.map((store) => (
            <div key={store.city} className="group bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] p-12 border border-zinc-100 dark:border-zinc-800 transition-all hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-950">
              <h2 className="text-3xl font-bold font-display uppercase tracking-tight mb-2">{store.city}</h2>
              <p className="text-amber-500 font-black uppercase text-[10px] tracking-widest mb-10">{store.neighborhood}</p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 opacity-40" />
                  <p className="text-sm font-medium">{store.address}</p>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 opacity-40" />
                  <p className="text-sm font-medium">{store.schedule}</p>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 opacity-40" />
                  <p className="text-sm font-medium">{store.phone}</p>
                </div>
              </div>

              <button className="mt-12 w-full border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 text-[10px] font-black uppercase tracking-widest group-hover:border-zinc-500 transition-colors">
                Cómo llegar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
