'use client'

import { useState } from 'react'
import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react'
import { deleteMultipleOrders } from '@/services/adminService'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'

export function BulkDeleteOrdersForm({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedCount, setSelectedCount] = useState(0)
  const router = useRouter()

  // Montaje para el portal
  useState(() => {
    setMounted(true)
  })

  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget
    const formData = new FormData(form)
    const orderIds = formData.getAll('orderIds')
    setSelectedCount(orderIds.length)
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (selectedCount === 0) {
      alert('Debes seleccionar al menos un pedido.')
      return
    }

    setShowModal(true)
  }

  const executeDelete = async () => {
    const form = document.getElementById('bulk-delete-form') as HTMLFormElement
    if (!form) return

    setLoading(true)
    try {
      const formData = new FormData(form)
      const res = await deleteMultipleOrders(formData)
      if (res && !res.success) {
        alert(res.error)
      } else {
        form.reset()
        setSelectedCount(0)
        setShowModal(false)
        router.refresh()
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-red-500/20 blur-[50px] rounded-full pointer-events-none" />
        <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>
        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 text-red-500">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-serif text-white italic mb-2">Eliminación Masiva</h3>
          <p className="text-sm text-zinc-400 font-light mb-8 leading-relaxed">
            ¿Estás seguro de obliterar <strong>{selectedCount}</strong> registros del firmamento? Esta acción es irreversible.
          </p>
          <div className="flex items-center gap-4 w-full">
            <button onClick={() => setShowModal(false)} className="flex-1 py-4 px-6 rounded-xl border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
              Cancelar
            </button>
            <button onClick={executeDelete} disabled={loading} className="flex-1 py-4 px-6 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null

  return (
    <form id="bulk-delete-form" onSubmit={handleFormSubmit} onChange={handleFormChange} className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-medium text-white italic">Gestión de Registros</h2>
        {selectedCount > 0 && (
          <button 
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest animate-in fade-in zoom-in"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar Seleccionados ({selectedCount})
          </button>
        )}
      </div>
      
      {children}

      {mounted && showModal && createPortal(modalContent, document.body)}
    </form>
  )
}
