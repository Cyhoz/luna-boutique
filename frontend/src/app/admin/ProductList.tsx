'use client'

import { useState } from 'react'
import { Pencil, X, Save, Trash2, Box, Tag, Palette, Ruler } from 'lucide-react'
import { updateProduct, deleteProduct, updateVariantStock } from '@/services/adminService'
import Image from 'next/image'

export function ProductList({ products }: { products: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({})

  const handleEdit = (p: any) => {
    setEditingId(p.id_producto)
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    const result = await updateProduct(formData)
    if (result.success) {
      setEditingId(null)
    } else {
      alert("Error al actualizar: " + result.error)
    }
    setIsPending(false)
  }

  const handleStockUpdate = async (variantId: string) => {
    const amount = stockUpdates[variantId]
    if (amount === undefined) return
    
    setIsPending(true)
    const result = await updateVariantStock(variantId, amount, 'Ajuste desde Panel Admin')
    if (result.success) {
      setStockUpdates(prev => {
        const next = { ...prev }
        delete next[variantId]
        return next
      })
    } else {
      alert("Error: " + result.error)
    }
    setIsPending(false)
  }

  return (
    <div className="space-y-8">
      {products.map((p) => (
        <div key={p.id_producto} className="glass rounded-[2.5rem] p-8 border-white/5 transition-all hover:border-white/10 group">
          {editingId === p.id_producto ? (
            <form onSubmit={handleSave} className="space-y-6">
              <input type="hidden" name="id" value={p.id_producto} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nombre</label>
                  <input name="nombre" defaultValue={p.nombre} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-white text-[11px] font-bold outline-none focus:ring-1 focus:ring-[#eab308]/50" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Marca</label>
                  <input name="marca" defaultValue={p.marca} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-white text-[11px] font-bold outline-none focus:ring-1 focus:ring-[#eab308]/50" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button type="submit" disabled={isPending} className="flex-1 h-12 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#eab308] transition-all disabled:opacity-50">
                  {isPending ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="w-12 h-12 glass rounded-xl flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Image & Info */}
              <div className="flex items-start gap-6 flex-1">
                <div className="relative w-24 h-32 glass rounded-2xl overflow-hidden border border-white/5 shrink-0">
                  <Image 
                    src={p.imagen_producto?.[0]?.url_imagen || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800'} 
                    alt={p.nombre} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="h-3 w-3 text-[#eab308]" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{p.categoria?.nombre || 'General'}</span>
                    </div>
                    <h3 className="text-xl font-serif text-white italic">{p.nombre}</h3>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{p.marca || 'Luna Original'}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(p)} className="text-[9px] font-black text-zinc-400 hover:text-white uppercase tracking-[0.2em] transition-all underline underline-offset-4">Editar</button>
                    <button 
                      onClick={async () => {
                        if (confirm(`¿Eliminar ${p.nombre}?`)) await deleteProduct(p.id_producto)
                      }}
                      className="text-[9px] font-black text-zinc-700 hover:text-red-500 uppercase tracking-[0.2em] transition-all"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>

              {/* Variants & Stock */}
              <div className="lg:w-96 space-y-4">
                {p.variante_producto?.map((v: any) => {
                  const inv = Array.isArray(v.inventario) ? v.inventario[0] : v.inventario;
                  const currentStock = inv?.stock_actual || 0;
                  const isLow = currentStock <= (inv?.stock_minimo || 5);

                  return (
                    <div key={v.id_variante} className="glass bg-white/[0.01] rounded-2xl p-4 border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                            <Ruler className="h-3 w-3 text-zinc-500" />
                            <span className="text-[10px] font-black text-white">{v.talla}</span>
                          </div>
                          {v.color && (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                              <Palette className="h-3 w-3 text-zinc-500" />
                              <span className="text-[10px] font-black text-white">{v.color.nombre}</span>
                            </div>
                          )}
                        </div>
                        <span className={`text-[10px] font-black ${isLow ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
                          {currentStock} EN STOCK
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          placeholder="+/-" 
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white text-[11px] font-bold outline-none focus:ring-1 focus:ring-[#eab308]/30"
                          onChange={(e) => setStockUpdates(prev => ({ ...prev, [v.id_variante]: parseInt(e.target.value) }))}
                          value={stockUpdates[v.id_variante] || ''}
                        />
                        <button 
                          onClick={() => handleStockUpdate(v.id_variante)}
                          disabled={isPending || !stockUpdates[v.id_variante]}
                          className="h-10 px-4 glass rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-30"
                        >
                          AJUSTAR
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

