'use client'

import { useState } from 'react'
import { Plus, Tag, Palette, CheckCircle2, AlertCircle, CreditCard } from 'lucide-react'
import { addCategory, addColor, addMedioPago, updateMedioPago, deleteMedioPago, getMediosPago } from '@/services/adminService'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

export function ConfigForms() {
  const [activeTab, setActiveTab] = useState<'category' | 'color' | 'payment'>('category')
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [mediosPago, setMediosPago] = useState<any[]>([])
  const [editingMedio, setEditingMedio] = useState<any | null>(null)

  useEffect(() => {
    if (activeTab === 'payment') {
      loadMedios()
    }
  }, [activeTab])

  const loadMedios = async () => {
    const data = await getMediosPago()
    setMediosPago(data)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, action: (fd: FormData) => Promise<any>) => {
    e.preventDefault()
    const form = e.currentTarget // Capturamos la referencia al formulario
    setLoading(true)
    setStatus(null)
    
    const formData = new FormData(form)
    const result = await action(formData)
    
    if (result.success) {
      setStatus({ type: 'success', message: 'Elemento sincronizado con el firmamento.' })
      form.reset() // Usamos la referencia capturada
      setEditingMedio(null)
      // Recargamos la lista inmediatamente
      if (activeTab === 'payment') {
        const data = await getMediosPago()
        setMediosPago(data)
      }
    } else {
      setStatus({ type: 'error', message: result.error || 'Error en la conexión estelar.' })
    }
    setLoading(false)
    
    setTimeout(() => setStatus(null), 3000)
  }

  return (
    <div className="glass rounded-[3rem] p-10 border-white/5 shadow-2xl">
      <div className="flex flex-wrap gap-4 mb-10 p-1.5 glass rounded-2xl border-white/5 w-fit">
        <button 
          onClick={() => setActiveTab('category')}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'category' ? 'bg-white text-black shadow-xl' : 'text-zinc-500 hover:text-white'}`}
        >
          <Tag className="h-3.5 w-3.5" /> Categorías
        </button>
        <button 
          onClick={() => setActiveTab('color')}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'color' ? 'bg-white text-black shadow-xl' : 'text-zinc-500 hover:text-white'}`}
        >
          <Palette className="h-3.5 w-3.5" /> Colores
        </button>
        <button 
          onClick={() => setActiveTab('payment')}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'payment' ? 'bg-white text-black shadow-xl' : 'text-zinc-500 hover:text-white'}`}
        >
          <CreditCard className="h-3.5 w-3.5" /> Medios de Pago
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'category' ? (
          <motion.form 
            key="category-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={(e) => handleSubmit(e, addCategory)} 
            className="space-y-6"
          >
            <div className="space-y-3">
              <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Nombre de Categoría</label>
              <input required name="nombre" type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all" placeholder="EJ: VESTIDOS DE NOCHE" />
            </div>
            <div className="space-y-3">
              <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Descripción</label>
              <textarea name="descripcion" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all min-h-[100px]" placeholder="Breve descripción de la colección..." />
            </div>
            <button type="submit" disabled={loading} className="w-full h-14 rounded-xl bg-[#eab308] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg">
              {loading ? 'Sincronizando...' : 'Añadir Categoría'}
            </button>
          </motion.form>
        ) : activeTab === 'color' ? (
          <motion.form 
            key="color-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={(e) => handleSubmit(e, addColor)} 
            className="space-y-6"
          >
            <div className="space-y-3">
              <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Nombre del Color</label>
              <input required name="nombre" type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all" placeholder="EJ: ORO LUNAR" />
            </div>
            <div className="space-y-3">
              <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Código Hexadecimal</label>
              <div className="flex gap-4">
                <input required name="codigo_hex" type="text" defaultValue="#000000" className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all" placeholder="#000000" />
                <input type="color" className="w-16 h-16 rounded-2xl bg-transparent border-none cursor-pointer" onChange={(e) => {
                  const input = e.target.form?.elements.namedItem('codigo_hex') as HTMLInputElement
                  if (input) input.value = e.target.value.toUpperCase()
                }} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full h-14 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg">
              {loading ? 'Sincronizando...' : 'Registrar Color'}
            </button>
          </motion.form>
        ) : (
          <motion.div 
            key="payment-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
          >
            {/* Lista de Medios Existentes */}
            {mediosPago.length > 0 && !editingMedio && (
              <div className="space-y-4">
                <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Medios de Pago Activos</label>
                <div className="grid gap-4">
                  {mediosPago.map((mp) => (
                    <div key={mp.id_medio_pago} className="flex items-center justify-between p-6 glass rounded-2xl border-white/5 group hover:border-white/10 transition-all">
                      <div>
                        <h4 className="text-white text-[11px] font-black uppercase tracking-widest">{mp.nombre}</h4>
                        <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mt-1">{mp.descripcion || 'Sin descripción'}</p>
                      </div>
                      <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => setEditingMedio(mp)}
                          className="px-4 py-2 rounded-lg bg-white/5 text-white text-[8px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={async () => {
                            if (confirm('¿Eliminar este medio de pago?')) {
                              await deleteMedioPago(mp.id_medio_pago)
                              loadMedios()
                            }
                          }}
                          className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formulario Añadir/Editar */}
            <form 
              key="payment-form"
              onSubmit={(e) => handleSubmit(e, editingMedio ? updateMedioPago : addMedioPago)} 
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                  {editingMedio ? 'Editando Medio de Pago' : 'Nuevo Medio de Pago'}
                </h3>
                {editingMedio && (
                  <button 
                    type="button" 
                    onClick={() => setEditingMedio(null)}
                    className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
                  >
                    Cancelar Edición
                  </button>
                )}
              </div>

              {editingMedio && <input type="hidden" name="id" value={editingMedio.id_medio_pago} />}

              <div className="space-y-3">
                <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Nombre del Medio de Pago</label>
                <input 
                  required 
                  name="nombre" 
                  type="text" 
                  defaultValue={editingMedio?.nombre || ''}
                  key={editingMedio?.id_medio_pago || 'new'}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#db2777]/50 outline-none transition-all" 
                  placeholder="EJ: WEBPAY PLUS" 
                />
              </div>
              <div className="space-y-3">
                <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Descripción / Instrucciones</label>
                <textarea 
                  name="descripcion" 
                  defaultValue={editingMedio?.descripcion || ''}
                  key={`desc-${editingMedio?.id_medio_pago || 'new'}`}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-[#db2777]/50 outline-none transition-all min-h-[100px]" 
                  placeholder="Información para el cliente..." 
                />
              </div>
              <button type="submit" disabled={loading} className="w-full h-14 rounded-xl bg-[#db2777] text-white text-[10px] font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg">
                {loading ? 'Sincronizando...' : editingMedio ? 'Actualizar Medio de Pago' : 'Añadir Medio de Pago'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
          >
            {status.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span className="text-[10px] font-bold uppercase tracking-widest">{status.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
