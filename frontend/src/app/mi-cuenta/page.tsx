import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/services/authService'
import { User, Package, Settings, LogOut, CheckCircle, Clock, Truck, MapPin, Stars, Moon, ShieldCheck, Sparkles, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { deleteAddress } from '@/services/addressService'
import { DeleteOrderButton } from '@/components/admin/DeleteOrderButton'
import { BulkDeleteOrdersForm } from '@/components/admin/BulkDeleteOrdersForm'
import Link from 'next/link'
import { formatPrice } from '@/utils/formatters'

export default async function AccountPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('cliente')
    .select('*')
    .eq('id_cliente', user.id)
    .single()

  const { data: addresses } = await supabase
    .from('direccion')
    .select('*')
    .eq('id_cliente', user.id)
    .order('es_principal', { ascending: false })

  const { data: orders } = await supabase
    .from('pedido')
    .select('*')
    .eq('id_cliente', user.id)
    .order('fecha_pedido', { ascending: false })

  const clientName = profile?.nombre || 'Usuario Estelar'
  const firstLetter = clientName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen lunar-gradient relative overflow-hidden pb-20">
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-[#3b0764]/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-40 -right-40 w-[400px] h-[400px] bg-[#db2777]/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 py-16 sm:px-8 max-w-7xl relative z-10">
        
        {/* Header de Bienvenida */}
        <div className="mb-20 space-y-4">
          <div className="flex items-center gap-4">
            <Sparkles className="h-5 w-5 text-[#eab308] animate-twinkle" />
            <span className="text-[11px] font-black uppercase tracking-[0.6em] text-zinc-500">Área Privada</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-medium text-white tracking-tighter">
            Bienvenido, <span className="gold-text italic">{clientName.split(' ')[0]}.</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Sidebar - Minimalist Glass */}
          <aside className="lg:col-span-3">
            <div className="glass rounded-[3rem] border-white/5 p-8 sticky top-32">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-24 h-24 glass rounded-[2rem] border-[#eab308]/20 flex items-center justify-center text-3xl font-serif gold-text shadow-[0_0_40px_rgba(234,179,8,0.1)] mb-6">
                  {firstLetter}
                </div>
                <h2 className="text-xl font-serif font-medium text-white mb-1">{clientName}</h2>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{user.email}</p>
              </div>
              
              <nav className="space-y-3">
                <Link href="#" className="flex items-center justify-between group px-6 py-5 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest transition-all">
                  <div className="flex items-center gap-4">
                    <User className="w-4 h-4" /> Perfil
                  </div>
                  <ChevronRight className="w-3 h-3" />
                </Link>
                <Link href="#direcciones" className="flex items-center justify-between group px-6 py-5 rounded-2xl glass text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 border-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <MapPin className="w-4 h-4 text-zinc-500" /> Direcciones
                  </div>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
                <Link href="#pedidos" className="flex items-center justify-between group px-6 py-5 rounded-2xl glass text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 border-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <Package className="w-4 h-4 text-zinc-500" /> Pedidos
                  </div>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
                <form action={logout}>
                  <button type="submit" className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 text-[10px] font-black uppercase tracking-widest transition-all mt-6">
                    <LogOut className="w-4 h-4" /> Finalizar Sesión
                  </button>
                </form>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-16">
            
            {/* Info Section */}
            <section className="glass rounded-[3.5rem] border-white/5 p-10 md:p-14 shadow-2xl">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-serif font-medium text-white italic">Credenciales Estelares</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Nombre Oficial</label>
                  <p className="text-lg text-zinc-200 font-medium tracking-tight glass px-6 py-4 rounded-2xl border-white/5">{profile?.nombre || 'No registrado'}</p>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Correo Registrado</label>
                  <p className="text-lg text-zinc-200 font-medium tracking-tight glass px-6 py-4 rounded-2xl border-white/5">{user.email}</p>
                </div>
              </div>
            </section>

            {/* Direcciones Section */}
            <section id="direcciones" className="space-y-10 pt-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <MapPin className="h-4 w-4 text-[#eab308]" />
                  <h2 className="text-4xl font-serif font-medium text-white tracking-tight leading-none italic">Santuarios de Entrega</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Nueva Dirección Card/Form */}
                <div className="glass rounded-[2.5rem] border-white/5 p-8 border-dashed flex flex-col items-center justify-center min-h-[250px] group hover:border-[#eab308]/30 transition-all">
                  <Plus className="h-8 w-8 text-zinc-800 mb-4 group-hover:text-[#eab308] transition-colors" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Añadir Nueva Ubicación</p>
                  
                  {/* Simplificado por ahora, se podría abrir un modal */}
                  <div className="w-full space-y-4">
                     {/* Aquí iría el formulario de dirección si no queremos modal */}
                  </div>
                </div>

                {addresses?.map((addr) => (
                  <div key={addr.id_direccion} className={`glass rounded-[2.5rem] p-8 border-white/5 relative group ${addr.es_principal ? 'ring-1 ring-[#eab308]/30 shadow-[0_0_40px_rgba(234,179,8,0.05)]' : ''}`}>
                    {addr.es_principal && (
                      <div className="absolute -top-3 left-8 bg-[#eab308] text-black text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Principal</div>
                    )}
                    
                    {/* Botón de borrar */}
                    <form action={deleteAddress} className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all">
                      <input type="hidden" name="addressId" value={addr.id_direccion} />
                      <button 
                        type="submit" 
                        className="p-3 glass rounded-xl border-white/5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        title="Eliminar Santuario"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>

                    <h3 className="text-lg font-serif text-white italic mb-4">{addr.alias}</h3>
                    <div className="space-y-2 text-zinc-400 text-xs font-light leading-relaxed">
                      <p className="text-white font-medium">{addr.nombre_destinatario}</p>
                      <p>{addr.direccion_linea1}</p>
                      {addr.direccion_linea2 && <p>{addr.direccion_linea2}</p>}
                      <p>{addr.ciudad}, {addr.estado_provincia}</p>
                      <p>{addr.codigo_postal} | {addr.pais}</p>
                      <p className="pt-2 flex items-center gap-2"><Sparkles className="h-3 w-3 text-zinc-700" /> {addr.telefono}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Orders Section */}
            <section id="pedidos" className="space-y-10 pt-20">
              <div className="flex items-center gap-4">
                <Moon className="h-4 w-4 text-[#db2777]" />
                <h2 className="text-4xl font-serif font-medium text-white tracking-tight leading-none italic">Crónica de Adquisiciones</h2>
              </div>
              
              {(!orders || orders.length === 0) ? (
                <div className="glass rounded-[4rem] border-white/5 p-24 text-center border-dashed">
                  <Package className="h-16 w-16 text-zinc-800 mx-auto mb-8" />
                  <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-[10px]">No hay registros en tu firmamento.</p>
                  <Link href="/coleccion" className="inline-block mt-8 text-[11px] font-black uppercase tracking-widest text-[#db2777] border-b border-[#db2777]/30 pb-1 hover:text-white transition-all">Empezar a Crear Historia</Link>
                </div>
              ) : (
                <BulkDeleteOrdersForm>
                  <div className="grid gap-12">
                  {orders.map((order) => {
                    const statusSteps = [
                      { label: 'Recibido', icon: CheckCircle, active: true },
                      { label: 'Pagado', icon: Clock, active: order.estado === 'pagado' || order.estado === 'enviado' },
                      { label: 'Enviado', icon: Truck, active: order.estado === 'enviado' },
                      { label: 'Entregado', icon: MapPin, active: order.estado === 'entregado' }
                    ]

                    return (
                      <div key={order.id_pedido} className="glass rounded-[3.5rem] border-white/5 p-10 md:p-12 shadow-xl hover:border-white/10 transition-all group">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12 pb-10 border-b border-white/5 relative">
                          <div className="absolute top-0 right-0">
                             <input type="checkbox" name="orderIds" value={order.id_pedido} className="accent-[#db2777] w-5 h-5 rounded cursor-pointer" />
                          </div>
                          <div className="space-y-3">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Identificador Único</p>
                            <h3 className="font-serif text-3xl gold-text tracking-tight">#{order.id_pedido.split('-')[0]}</h3>
                          </div>
                          <div className="md:text-right flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                            <div className="space-y-3">
                              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Valor de la Pieza</p>
                              <p className="text-4xl font-serif text-white tracking-tighter">${formatPrice(Number(order.total))}</p>
                            </div>
                            <DeleteOrderButton orderId={order.id_pedido} />
                          </div>
                        </div>

                        {/* Timeline UI - Cinematic */}
                        <div className="relative mb-12 px-6">
                          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2 z-0" />
                          <div className="flex justify-between relative z-10">
                            {statusSteps.map((step, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-700 ${
                                  step.active 
                                    ? 'bg-white border-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
                                    : 'glass border-white/5 text-zinc-700'
                                }`}>
                                  <step.icon className={`h-5 w-5 ${step.active ? 'animate-pulse' : ''}`} />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${step.active ? 'text-white' : 'text-zinc-700'}`}>
                                  {step.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  </div>
                </BulkDeleteOrdersForm>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
