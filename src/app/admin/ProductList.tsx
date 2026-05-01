'use client'

import { useState } from 'react'
import { Pencil, X, Save, Trash2 } from 'lucide-react'
import { updateProduct } from './actions'

export function ProductList({ products }: { products: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleEdit = (p: any) => {
    setEditingId(p.id)
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    const result = await updateProduct(formData)
    if (result.success) {
      setEditingId(null)
    } else {
      alert("Error al actualizar")
    }
    setIsPending(false)
  }

  return (
    <div className="space-y-6">
      {products.map((p) => (
        <div key={p.id} className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-900 shadow-sm transition-all hover:shadow-md">
          {editingId === p.id ? (
            <form onSubmit={handleSave} className="space-y-4">
              <input type="hidden" name="id" value={p.id} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Nombre</label>
                  <input name="name" defaultValue={p.name} className="w-full rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Precio Base</label>
                  <input name="base_price" type="number" step="0.01" defaultValue={p.base_price} className="w-full rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-2xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input name="is_new" type="checkbox" defaultChecked={p.is_new} className="w-4 h-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Novedad</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input name="is_on_sale" type="checkbox" defaultChecked={p.is_on_sale} className="w-4 h-4 rounded border-zinc-300 text-red-500 focus:ring-red-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Oferta</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Precio Oferta</label>
                  <input name="sale_price" type="number" step="0.01" defaultValue={p.sale_price} className="w-full rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all" />
                </div>
                <div className="flex items-end gap-2">
                  <button type="submit" disabled={isPending} className="flex-1 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50">
                    {isPending ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button type="button" onClick={() => setEditingId(null)} className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden">
                  <img src={p.product_variants?.[0]?.image_url} alt={p.name} className="object-cover w-full h-full" />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-display uppercase tracking-tight">{p.name}</h3>
                  <div className="flex gap-2 mt-1">
                    {p.is_new && <span className="text-[8px] font-black uppercase tracking-widest text-amber-500">Novedad</span>}
                    {p.is_on_sale && <span className="text-[8px] font-black uppercase tracking-widest text-red-500">Oferta (${p.sale_price})</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Base</p>
                  <p className="font-bold text-sm">${p.base_price}</p>
                </div>
                <button 
                  onClick={() => handleEdit(p)}
                  className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-100 dark:border-zinc-800 transition-all hover:scale-105 shadow-sm"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
