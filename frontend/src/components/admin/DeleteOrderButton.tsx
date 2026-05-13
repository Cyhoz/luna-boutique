'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react'
import { deleteOrder } from '@/services/adminService'
import { useRouter } from 'next/navigation'

export function DeleteOrderButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await deleteOrder(orderId)
      if (res && !res.success) {
        alert(res.error)
      } else {
        setShowModal(false)
        router.refresh() // Obligamos al navegador a recargar los datos
      }
    } catch (e: any) {
      alert(e.message)
      setShowModal(false)
    } finally {
      setLoading(false)
    }
  }

  const modalContent = showModal ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Efecto de luz de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-red-500/20 blur-[50px] rounded-full pointer-events-none" />
        
        <button 
          onClick={() => setShowModal(false)}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 text-red-500">
            <AlertTriangle className="h-8 w-8" />
          </div>
          
          <h3 className="text-2xl font-serif text-white italic mb-2">Eliminar Registro</h3>
          <p className="text-sm text-zinc-400 font-light mb-8 leading-relaxed">
            ¿Estás seguro de que deseas obliterar la orden <strong className="text-white font-black tracking-widest uppercase">#{orderId.split('-')[0]}</strong> del firmamento? Esta acción es irreversible.
          </p>

          <div className="flex items-center gap-4 w-full">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-4 px-6 rounded-xl border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 py-4 px-6 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        disabled={loading}
        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
        title="Eliminar Pedido"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>

      {/* Renderizamos el modal en el body para escapar de la opacidad de las tablas */}
      {mounted && showModal && createPortal(modalContent, document.body)}
    </>
  )
}

