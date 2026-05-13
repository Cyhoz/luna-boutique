'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useNotificationStore } from '@/store/notificationStore'
import { ArrowLeft, Lock, CreditCard, CheckCircle2, Truck, ShieldCheck, ShoppingBag, Stars, Moon, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMediosPago } from '@/services/adminService'

const SHIPPING_RATES: Record<string, number> = {
  'santiago': 3500,
  'valparaiso': 4500,
  'concepcion': 5000,
  'default': 6000
}

export default function CheckoutPage() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const { items, getTotal, clearCart } = useCartStore()
  const { addNotification } = useNotificationStore()
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [city, setCity] = useState('')
  const [mediosPago, setMediosPago] = useState<any[]>([])
  const [selectedMedio, setSelectedMedio] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    loadMedios()
  }, [])

  const loadMedios = async () => {
    const data = await getMediosPago()
    setMediosPago(data)
    if (data.length > 0) setSelectedMedio(data[0])
  }

  if (!mounted) return null

  const subtotal = getTotal()
  
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen lunar-gradient px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-10 rounded-[3rem] border-white/5 max-w-md w-full"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
            <ShoppingBag className="w-8 h-8 text-zinc-500" />
          </div>
          <h2 className="text-3xl font-serif font-medium mb-4 text-white">Tu Bolsa está Vacía</h2>
          <p className="text-zinc-500 mb-10 text-sm leading-relaxed">Parece que aún no has seleccionado ninguna pieza de nuestra exclusiva colección.</p>
          <Link href="/coleccion" className="block w-full py-5 bg-[#db2777] text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_0_30px_rgba(219,39,119,0.2)] hover:scale-105 transition-all">
            Explorar Colección
          </Link>
        </motion.div>
      </div>
    )
  }

  const cityKey = city.toLowerCase().trim()
  let shipping = city ? (SHIPPING_RATES[cityKey] || SHIPPING_RATES['default']) : 0

  if (subtotal > 150000) { 
    shipping = 0
  }

  const total = subtotal + shipping

  const executeCheckout = async () => {
    setIsProcessing(true)

    if (!formRef.current) {
      setIsProcessing(false)
      return
    }

    const formData = new FormData(formRef.current)
    
    if (!formData.get('email') || !formData.get('firstName')) {
      addNotification("Por favor completa los campos requeridos.", "error")
      setIsProcessing(false)
      return
    }

    try {
      const { processCheckout } = await import('@/services/checkoutService')
      const result = await processCheckout(items, total, shipping, formData, selectedMedio?.nombre || 'Webpay')
      
      if (!result.success) {
        addNotification(result.error || "Error al procesar el pedido.", "error")
        setIsProcessing(false)
        return
      }

      if (result.success && result.orderId) {
        const paymentRes = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            orderId: result.orderId,
            gateway: selectedMedio?.nombre || 'Webpay'
          })
        })

        const paymentData = await paymentRes.json()

        if (paymentData.url) {
          clearCart()
          window.location.href = paymentData.url
        } else {
          addNotification(paymentData.error || 'Error al conectar con la pasarela', 'error')
          setIsProcessing(false)
        }
      } else {
        addNotification(result.error || "Hubo un error en la base de datos.", 'error')
        setIsProcessing(false)
      }
    } catch (error: any) {
      console.error(error)
      addNotification("Fallo crítico: " + error.message, "error")
      setIsProcessing(false)
    }
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    executeCheckout()
  }

  return (
    <div className="lunar-gradient min-h-screen relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#3b0764]/10 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-[#db2777]/5 blur-[120px] rounded-full" />
      </div>

      {/* Header Simplificado */}
      <div className="border-b border-white/5 py-8 relative z-10">
        <div className="container mx-auto px-6 flex justify-between items-center max-w-7xl">
          <Link href="/" className="text-2xl font-serif font-medium tracking-tight gold-text">LUNA BOUTIQUE</Link>
          <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] glass px-5 py-2.5 rounded-full border-white/5">
            <Lock className="w-3.5 h-3.5 text-[#eab308]" /> Transacción Encriptada
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-20">
          
          {/* Formulario Izquierdo */}
          <div className="lg:col-span-7">
            <form 
              ref={formRef}
              id="checkout-form" 
              onSubmit={handleCheckout} 
              className="space-y-16"
            >
              
              <section className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-2xl glass text-[#eab308] flex items-center justify-center font-black text-sm border-white/10">1</div>
                  <h2 className="text-2xl font-serif font-medium text-white italic">Información Estelar</h2>
                </div>
                <div className="grid gap-6">
                  <div className="space-y-3">
                    <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Correo Electrónico</label>
                    <input 
                      name="email" 
                      required 
                      type="email" 
                      id="email" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white text-xs font-bold tracking-widest focus:ring-2 focus:ring-[#eab308]/30 focus:border-[#eab308]/50 outline-none transition-all" 
                      placeholder="TU@EMAIL.COM" 
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-2xl glass text-[#db2777] flex items-center justify-center font-black text-sm border-white/10">2</div>
                  <h2 className="text-2xl font-serif font-medium text-white italic">Destino de Entrega</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label htmlFor="firstName" className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Nombre</label>
                    <input name="firstName" required type="text" id="firstName" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white text-xs font-bold tracking-widest focus:ring-2 focus:ring-[#eab308]/30 focus:border-[#eab308]/50 outline-none transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="lastName" className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Apellidos</label>
                    <input name="lastName" required type="text" id="lastName" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white text-xs font-bold tracking-widest focus:ring-2 focus:ring-[#eab308]/30 focus:border-[#eab308]/50 outline-none transition-all" />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-3">
                    <label htmlFor="address" className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Dirección de Envío</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                      <input name="address" required type="text" id="address" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-xs font-bold tracking-widest focus:ring-2 focus:ring-[#db2777]/30 focus:border-[#db2777]/50 outline-none transition-all" placeholder="CALLE, NÚMERO, APTO..." />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="city" className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Ciudad / Región</label>
                    <input 
                      name="city" 
                      required 
                      type="text" 
                      id="city" 
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white text-xs font-bold tracking-widest focus:ring-2 focus:ring-[#eab308]/30 focus:border-[#eab308]/50 outline-none transition-all" 
                      placeholder="EJ: SANTIAGO"
                    />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="zip" className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Código Postal</label>
                    <input name="zip" required type="text" id="zip" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white text-xs font-bold tracking-widest focus:ring-2 focus:ring-[#eab308]/30 focus:border-[#eab308]/50 outline-none transition-all" />
                  </div>
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-2xl glass text-white flex items-center justify-center font-black text-sm border-white/10">3</div>
                  <h2 className="text-2xl font-serif font-medium text-white italic">Método de Pago</h2>
                </div>
                <div className="grid gap-6">
                  {mediosPago.length > 0 ? (
                    mediosPago.map((medio) => (
                      <button
                        type="button"
                        key={medio.id_medio_pago}
                        onClick={() => setSelectedMedio(medio)}
                        className={`w-full glass p-8 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${
                          selectedMedio?.id_medio_pago === medio.id_medio_pago 
                          ? 'border-[#eab308] shadow-[0_0_30px_rgba(234,179,8,0.1)]' 
                          : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-6 text-left">
                          <div className={`p-4 glass rounded-2xl border-white/10 transition-all ${
                            selectedMedio?.id_medio_pago === medio.id_medio_pago ? 'text-[#eab308]' : 'text-zinc-600'
                          }`}>
                            <CreditCard className="w-8 h-8" />
                          </div>
                          <div>
                            <p className={`text-sm font-black uppercase tracking-[0.2em] transition-all ${
                              selectedMedio?.id_medio_pago === medio.id_medio_pago ? 'text-white' : 'text-zinc-500'
                            }`}>{medio.nombre}</p>
                            <p className="text-[10px] text-zinc-600 mt-1 uppercase font-bold tracking-widest">{medio.descripcion || 'PAGO SEGURO'}</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                          selectedMedio?.id_medio_pago === medio.id_medio_pago ? 'border-[#eab308]' : 'border-zinc-800'
                        }`}>
                          {selectedMedio?.id_medio_pago === medio.id_medio_pago && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="glass p-8 rounded-[2rem] border-2 border-[#eab308]/30 flex items-center justify-between shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                      <div className="flex items-center gap-6">
                        <div className="p-4 glass rounded-2xl border-white/10">
                          <CreditCard className="w-8 h-8 text-[#eab308]" />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.2em] text-white">Pago Seguro</p>
                          <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-widest">Tarjeta de Crédito / Débito / Transferencia</p>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-[#eab308] flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </form>
          </div>

          {/* Resumen Derecho */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 glass rounded-[3.5rem] p-10 border-white/5 shadow-2xl">
              <h2 className="text-2xl font-serif font-medium text-white italic mb-10">Tu Selección</h2>
              
              <ul className="space-y-8 mb-10 border-b border-white/5 pb-10 max-h-[40vh] overflow-y-auto custom-scrollbar pr-4">
                {items.map((item, index) => (
                  <li key={`${item.id}-${index}`} className="flex gap-6 items-center">
                    <div className="relative h-24 w-20 flex-shrink-0 glass rounded-2xl overflow-hidden border-white/10 p-1">
                      <div className="relative h-full w-full rounded-xl overflow-hidden">
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name} 
                          fill 
                          sizes="(max-width: 80px) 100vw, 80px"
                          className="object-cover" 
                        />
                      </div>
                      <span className="absolute -top-2 -right-2 w-7 h-7 bg-[#db2777] text-white rounded-full flex items-center justify-center text-[10px] font-black z-10 border-2 border-zinc-950 pink-glow">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-xs font-black text-white uppercase tracking-widest leading-tight">{item.name}</h3>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{item.color} / {item.size}</p>
                    </div>
                    <div className="text-sm font-serif gold-text">
                      ${(item.price * Number(item.quantity)).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 uppercase tracking-[0.3em] font-black text-[9px]">Subtotal</span>
                  <span className="text-sm font-serif text-white">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 uppercase tracking-[0.3em] font-black text-[9px]">Envío Boutique</span>
                  <span className="text-sm font-serif text-[#eab308]">
                    {shipping === 0 ? 'CORTESÍA' : `$${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#db2777]">Total de la Pieza</span>
                    <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">Impuestos incluidos</p>
                  </div>
                  <span className="text-4xl font-serif gold-text tracking-tighter">${total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={executeCheckout}
                disabled={isProcessing}
                className={`
                  relative z-[100] w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 transition-all duration-700
                  ${isProcessing 
                    ? 'bg-zinc-900 text-zinc-600 cursor-wait border border-white/5' 
                    : 'bg-white text-black hover:bg-[#eab308] hover:scale-[1.02] active:scale-[0.98]'}
                `}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-4">
                    <div className="w-5 h-5 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Finalizar Adquisición
                    <Stars className="w-4 h-4 text-black/20 animate-twinkle" />
                  </>
                )}
              </button>

              <div className="mt-10 pt-8 border-t border-white/5 flex justify-center gap-10">
                <div className="flex items-center gap-3 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                  <ShieldCheck className="h-4 w-4 text-emerald-500/50" /> Protegido
                </div>
                <div className="flex items-center gap-3 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                  <Truck className="h-4 w-4 text-amber-500/50" /> Asegurado
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

