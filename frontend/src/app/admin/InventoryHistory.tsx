'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { History, ArrowUpRight, ArrowDownRight, RefreshCcw, User, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function InventoryHistory() {
  const [movements, setMovements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchMovements()

    const channel = supabase
      .channel('movement-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'movimiento_inventario' }, () => {
        fetchMovements()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchMovements() {
    const { data, error } = await supabase
      .from('movimiento_inventario')
      .select(`
        id_movimiento,
        tipo_movimiento,
        cantidad,
        fecha_movimiento,
        motivo,
        inventario (
          id_variante,
          variante_producto (
            talla,
            producto (nombre),
            color (nombre)
          )
        )
      `)
      .order('fecha_movimiento', { ascending: false })
      .limit(15)

    if (!error && data) {
      setMovements(data)
    } else if (error) {
      console.error("Error fetching movements:", error)
    }
    setLoading(false)
  }

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'entrada': return <ArrowUpRight className="h-4 w-4 text-emerald-500" />
      case 'salida': return <ArrowDownRight className="h-4 w-4 text-red-500" />
      default: return <RefreshCcw className="h-4 w-4 text-[#eab308]" />
    }
  }

  if (loading) return <div className="animate-pulse glass h-64 rounded-[2.5rem] border-white/5" />

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-[#eab308] border-white/10">
          <History className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-serif font-medium text-white italic">Bitácora de Suministros</h2>
      </div>

      <div className="glass rounded-[2.5rem] overflow-hidden border-white/5 bg-white/[0.01]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">
                <th className="px-8 py-6">Evento</th>
                <th className="px-8 py-6">Pieza & Variante</th>
                <th className="px-8 py-6">Magnitud</th>
                <th className="px-8 py-6">Motivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {movements.map((m, idx) => (
                  <motion.tr 
                    key={m.id_movimiento}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-white/[0.02] transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg glass border-white/5 ${
                          m.tipo_movimiento === 'entrada' ? 'bg-emerald-500/10' : 
                          m.tipo_movimiento === 'salida' ? 'bg-red-500/10' : 'bg-[#eab308]/10'
                        }`}>
                          {getIcon(m.tipo_movimiento)}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">{m.tipo_movimiento}</p>
                          <p className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest flex items-center gap-1">
                            <Calendar className="h-2 w-2" /> {new Date(m.fecha_movimiento).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{m.inventario?.variante_producto?.producto?.nombre}</p>
                      <p className="text-[8px] text-zinc-600 uppercase font-bold mt-1">
                        {m.inventario?.variante_producto?.talla} / {m.inventario?.variante_producto?.color?.nombre}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-lg font-serif ${
                        m.tipo_movimiento === 'entrada' ? 'text-emerald-500' : 
                        m.tipo_movimiento === 'salida' ? 'text-red-500' : 'text-[#eab308]'
                      }`}>
                        {m.tipo_movimiento === 'salida' ? '-' : '+'}{Math.abs(m.cantidad)}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[10px] text-zinc-500 font-medium italic max-w-[200px] truncate">{m.motivo || 'Sin descripción'}</p>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
