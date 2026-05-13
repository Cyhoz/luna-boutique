'use client'

import { AlertTriangle, Bell, ArrowRight, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function StockAlerts() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchAlerts()

    // Suscribirse a cambios en la tabla inventario para actualizar alertas en tiempo real
    const channel = supabase
      .channel('inventory-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventario' }, () => {
        fetchAlerts()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchAlerts() {
    // Leemos desde la vista que creamos en el esquema
    const { data, error } = await supabase
      .from('vista_alertas_stock')
      .select('*')
    
    if (!error && data) {
      setAlerts(data)
    }
    setLoading(false)
  }

  if (loading) return <div className="animate-pulse glass h-40 rounded-[2.5rem] border-white/5" />

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-red-500 border-red-500/20">
            <Bell className="h-5 w-5 animate-bounce" />
          </div>
          <h2 className="text-2xl font-serif font-medium text-white italic">Alertas de Emergencia</h2>
        </div>
        <span className="px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest">
          {alerts.length} Críticas
        </span>
      </div>

      <AnimatePresence>
        {alerts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-[2.5rem] p-12 text-center border-emerald-500/10 bg-emerald-500/5"
          >
            <Package className="h-12 w-12 text-emerald-500/20 mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60">Suministros Estables en la Galaxia</p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {alerts.map((alert, idx) => (
              <motion.div
                key={alert.sku}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass rounded-[2rem] p-6 border-white/5 flex items-center justify-between group hover:border-red-500/30 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-red-500 border-red-500/20">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none mb-1">{alert.producto_nombre}</h3>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                      {alert.talla} / {alert.color_nombre} <span className="mx-2 text-zinc-800">|</span> SKU: {alert.sku}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-2">
                    <span className="text-xl font-serif text-red-500">{alert.stock_actual}</span>
                    <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">/ Min {alert.stock_minimo}</span>
                  </div>
                  <button className="flex items-center gap-2 text-[9px] font-black text-[#eab308] uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-all">
                    Abastecer <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
