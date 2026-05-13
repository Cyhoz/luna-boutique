'use client'

import { useState } from 'react'
import { Truck, Loader2 } from 'lucide-react'
import { markAsShipped } from '@/services/adminService'

export function ShippingButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleShip = async (formData: FormData) => {
    setLoading(true)
    setError('')
    try {
      await markAsShipped(orderId, formData)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleShip} className="flex items-center justify-end gap-3">
      <div className="flex flex-col gap-2">
        <input 
          required 
          name="paqueteria" 
          type="text" 
          placeholder="Starken..." 
          className="w-32 bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white text-[10px] font-bold tracking-widest outline-none" 
        />
        <input 
          required 
          name="numero_guia" 
          type="text" 
          placeholder="Guía #" 
          className="w-32 bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white text-[10px] font-bold tracking-widest outline-none" 
        />
        {error && <span className="text-red-500 text-[8px] absolute -bottom-4 right-0">{error}</span>}
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-12 h-12 glass rounded-xl flex items-center justify-center text-[#eab308] hover:bg-[#eab308] hover:text-black transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Truck className="h-5 w-5" />}
      </button>
    </form>
  )
}
