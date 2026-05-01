import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/login/actions'
import { User, Package, Settings, LogOut, CheckCircle, Clock, Truck, MapPin } from 'lucide-react'

export default async function AccountPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center font-black text-xl text-white dark:text-zinc-900 font-display">
                {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <h2 className="font-bold text-lg truncate font-display uppercase tracking-tight">{profile?.full_name || 'Usuario'}</h2>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">{user.email}</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-black uppercase tracking-widest transition-all">
                <User className="w-4 h-4" /> Mi Perfil
              </a>
              <a href="#pedidos" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-black uppercase tracking-widest transition-all">
                <Package className="w-4 h-4" /> Mis Pedidos
              </a>
              <form action={logout}>
                <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-black uppercase tracking-widest transition-all mt-4">
                  <LogOut className="w-4 h-4" /> Cerrar Sesión
                </button>
              </form>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-12">
          
          <section id="perfil" className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-bold font-display uppercase tracking-tight mb-8">Datos Personales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Nombre Completo</label>
                <p className="font-bold text-zinc-900 dark:text-white">{profile?.full_name || 'No especificado'}</p>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Email</label>
                <p className="font-bold text-zinc-900 dark:text-white">{user.email}</p>
              </div>
              {profile?.role === 'admin' && (
                <div className="sm:col-span-2 p-6 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="h-5 w-5 text-amber-500" />
                    <p className="text-sm font-black uppercase tracking-widest text-amber-500">Acceso Admin</p>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mb-4 font-medium leading-relaxed">
                    Tienes permisos para gestionar el inventario, ver todas las órdenes y configurar la tienda.
                  </p>
                  <a href="/admin" className="inline-block bg-amber-500 text-white font-black uppercase tracking-widest text-[10px] px-6 py-2.5 rounded-xl hover:scale-105 transition-transform shadow-lg shadow-amber-500/20">
                    Ir al Panel Admin
                  </a>
                </div>
              )}
            </div>
          </section>

          <section id="pedidos" className="space-y-6">
            <h2 className="text-2xl font-bold font-display uppercase tracking-tight px-2">Historial de Pedidos</h2>
            
            {(!orders || orders.length === 0) ? (
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-20 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
                <Package className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No has realizado pedidos aún.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {orders.map((order) => {
                  const statusSteps = [
                    { label: 'Recibido', icon: CheckCircle, active: true },
                    { label: 'Pagado', icon: Clock, active: order.status === 'paid' || order.status === 'shipped' },
                    { label: 'Enviado', icon: Truck, active: order.status === 'shipped' },
                    { label: 'Entregado', icon: MapPin, active: false } // Simulado
                  ]

                  return (
                    <div key={order.id} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2.5rem] p-8 shadow-sm overflow-hidden">
                      <div className="flex flex-col md:flex-row justify-between gap-6 mb-10 pb-8 border-b border-zinc-50 dark:border-zinc-900">
                        <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Orden ID</p>
                          <h3 className="font-black text-lg uppercase tracking-tight">#{order.id.split('-')[0]}</h3>
                        </div>
                        <div className="md:text-right">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Total del Pedido</p>
                          <p className="text-2xl font-black font-display tracking-tight">${order.total_amount.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Timeline UI */}
                      <div className="relative mb-10 px-4">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 dark:bg-zinc-900 -translate-y-1/2 z-0" />
                        <div className="flex justify-between relative z-10">
                          {statusSteps.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                                step.active 
                                  ? 'bg-zinc-950 border-white text-white dark:bg-white dark:border-zinc-950 dark:text-zinc-950' 
                                  : 'bg-zinc-50 border-white text-zinc-300 dark:bg-zinc-900 dark:border-zinc-950'
                              }`}>
                                <step.icon className="h-4 w-4" />
                              </div>
                              <span className={`text-[9px] font-black uppercase tracking-widest ${step.active ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.tracking_number && (
                        <div className="mt-8 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Truck className="h-4 w-4 text-emerald-500" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Número de Seguimiento:</p>
                          </div>
                          <span className="font-mono text-xs font-bold bg-white dark:bg-zinc-900 px-3 py-1 rounded-lg border border-emerald-500/20">
                            {order.tracking_number}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  )
}

import { ShieldCheck } from 'lucide-react'
