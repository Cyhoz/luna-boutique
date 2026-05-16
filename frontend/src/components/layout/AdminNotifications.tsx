'use client'

import { useState, useEffect } from 'react'
import { Bell, AlertTriangle, Package, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export function AdminNotifications() {
  const [isOpen, setIsOpen] = useState(false)
  const [alerts, setAlerts] = useState<{
    outOfStock: number
    lowStock: number
    pendingOrders: number
  }>({ outOfStock: 0, lowStock: 0, pendingOrders: 0 })
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('usuario')
        .select('role')
        .eq('id_usuario', user.id)
        .single()
      
      if (profile?.role !== 'admin') return

      const { data: variants } = await supabase
        .from('variante_producto')
        .select('stock_actual')
      
      const outOfStock = variants?.filter(v => (v.stock_actual || 0) === 0).length || 0
      const lowStock = variants?.filter(v => (v.stock_actual || 0) > 0 && (v.stock_actual || 0) <= 5).length || 0

      const { data: orders } = await supabase
        .from('pedido')
        .select('id_pedido')
        .eq('estado', 'pagado')

      setAlerts({
        outOfStock,
        lowStock,
        pendingOrders: orders?.length || 0
      })
      setLoading(false)
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [supabase])

  const hasAlerts = alerts.outOfStock > 0 || alerts.lowStock > 0 || alerts.pendingOrders > 0

  if (loading && !hasAlerts) return null

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 relative text-muted-foreground hover:text-primary transition-all"
      >
        <Bell className="h-5 w-5" />
        {hasAlerts && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#db2777] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#db2777] border-2 border-background"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-6 w-80 bg-background border border-zinc-100 dark:border-zinc-800 rounded-[2rem] shadow-3xl z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-muted/30">
                <h3 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-primary">Centro de Control</h3>
              </div>
              
              <div className="p-4 space-y-2">
                <Link 
                  href="/admin" 
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${alerts.outOfStock > 0 ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-muted/50'}`}
                >
                  <div className={`p-2.5 rounded-xl ${alerts.outOfStock > 0 ? 'bg-red-500 text-white' : 'bg-secondary text-muted-foreground'}`}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary">{alerts.outOfStock} Agotados</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tight">Acción Inmediata</p>
                  </div>
                </Link>

                <Link 
                  href="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-all"
                >
                  <div className={`p-2.5 rounded-xl ${alerts.lowStock > 0 ? 'bg-accent text-white' : 'bg-secondary text-muted-foreground'}`}>
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary">{alerts.lowStock} Stock Bajo</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tight">Menos de 5 unidades</p>
                  </div>
                </Link>

                <Link 
                  href="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-all"
                >
                  <div className={`p-2.5 rounded-xl ${alerts.pendingOrders > 0 ? 'bg-[#db2777] text-white' : 'bg-secondary text-muted-foreground'}`}>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary">{alerts.pendingOrders} Pedidos</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tight">Listos para envío</p>
                  </div>
                </Link>
              </div>

              <Link 
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="block p-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary border-t border-zinc-100 dark:border-zinc-800 transition-colors"
              >
                Panel de Gestión
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
