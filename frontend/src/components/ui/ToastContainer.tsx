'use client'

import { useNotificationStore } from '@/store/notificationStore'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'

export function ToastContainer() {
  const { notifications, removeNotification } = useNotificationStore()

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-4 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto"
          >
            <div className={`
              relative overflow-hidden glass rounded-2xl border px-6 py-5 shadow-2xl backdrop-blur-xl
              ${n.type === 'success' ? 'border-emerald-500/30' : n.type === 'error' ? 'border-red-500/30' : 'border-white/10'}
            `}>
              {/* Background Glow */}
              <div className={`
                absolute -right-10 -top-10 w-24 h-24 blur-[50px] opacity-20
                ${n.type === 'success' ? 'bg-emerald-500' : n.type === 'error' ? 'bg-red-500' : 'bg-white'}
              `} />

              <div className="flex items-start gap-4">
                <div className="mt-0.5">
                  {n.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                  {n.type === 'error' && <AlertCircle className="h-5 w-5 text-red-400" />}
                  {n.type === 'info' && <Info className="h-5 w-5 text-blue-400" />}
                </div>

                <div className="flex-1 space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    {n.type === 'success' ? 'Transacción Exitosa' : n.type === 'error' ? 'Aviso del Sistema' : 'Notificación'}
                  </h4>
                  <p className="text-sm font-medium text-white/90 leading-relaxed">
                    {n.message}
                  </p>
                </div>

                <button 
                  onClick={() => removeNotification(n.id)}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors text-zinc-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Progress Bar Animation */}
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className={`
                  absolute bottom-0 left-0 h-[2px]
                  ${n.type === 'success' ? 'bg-emerald-500/50' : n.type === 'error' ? 'bg-red-500/50' : 'bg-white/20'}
                `}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
