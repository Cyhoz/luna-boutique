'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { ArrowLeft, Lock, CreditCard, CheckCircle2, Truck, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SHIPPING_RATES: Record<string, number> = {
  'santiago': 3500,
  'valparaiso': 4500,
  'concepcion': 5000,
  'default': 6000
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [city, setCity] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-full mb-6">
          <ShoppingBag className="w-12 h-12 text-zinc-300" />
        </div>
        <h2 className="text-3xl font-bold mb-4 font-display tracking-tight">TU CARRITO ESTÁ VACÍO</h2>
        <p className="text-zinc-500 mb-8 max-w-xs">Parece que aún no has seleccionado ninguna pieza de nuestra colección.</p>
        <Link href="/coleccion" className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform">
          Explorar Colección
        </Link>
      </div>
    )
  }

  const subtotal = getTotal()
  const cityKey = city.toLowerCase().trim()
  let shipping = city ? (SHIPPING_RATES[cityKey] || SHIPPING_RATES['default']) : 0

  if (subtotal > 150000) { // Asumiendo CLP por el contexto de Santiago/Chile
    shipping = 0
  }

  const total = subtotal + shipping

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)

    const formData = new FormData(e.currentTarget)

    try {
      const { processCheckout } = await import('./actions')
      const result = await processCheckout(items, total, shipping, formData)

      if (result.success && result.orderId) {
        const paymentRes = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: result.orderId })
        })

        const paymentData = await paymentRes.json()

        if (paymentData.url) {
          clearCart()
          window.location.href = paymentData.url
        } else {
          alert("Error generando el pago: " + (paymentData.error || 'Desconocido'))
          setIsProcessing(false)
        }
      } else {
        alert(result.error || "Hubo un error procesando tu orden.")
        setIsProcessing(false)
      }
    } catch (error) {
      console.error(error)
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      {/* Header Simplificado para Checkout */}
      <div className="border-b border-zinc-100 dark:border-zinc-900 py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold tracking-tighter font-display uppercase">ANTIGRAVITY.</Link>
          <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <Lock className="w-3 h-3" /> Pago 100% Seguro
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Formulario Izquierdo */}
          <div className="lg:col-span-7">
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-12">
              
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm">1</div>
                  <h2 className="text-2xl font-bold font-display uppercase tracking-tight">Información de Contacto</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Correo Electrónico</label>
                    <input 
                      name="email" 
                      required 
                      type="email" 
                      id="email" 
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-5 py-4 outline-none focus:ring-2 focus:ring-amber-500 transition-all" 
                      placeholder="ejemplo@correo.com" 
                    />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm">2</div>
                  <h2 className="text-2xl font-bold font-display uppercase tracking-tight">Detalles de Entrega</h2>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Nombre</label>
                    <input name="firstName" required type="text" id="firstName" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-5 py-4 outline-none focus:ring-2 focus:ring-amber-500 transition-all" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Apellidos</label>
                    <input name="lastName" required type="text" id="lastName" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-5 py-4 outline-none focus:ring-2 focus:ring-amber-500 transition-all" />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="address" className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Dirección de Envío</label>
                    <input name="address" required type="text" id="address" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-5 py-4 outline-none focus:ring-2 focus:ring-amber-500 transition-all" placeholder="Calle, número, departamento..." />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Ciudad / Región</label>
                    <input 
                      name="city" 
                      required 
                      type="text" 
                      id="city" 
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-5 py-4 outline-none focus:ring-2 focus:ring-amber-500 transition-all" 
                      placeholder="Ej: Santiago"
                    />
                  </div>
                  <div>
                    <label htmlFor="zip" className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Código Postal</label>
                    <input name="zip" required type="text" id="zip" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-5 py-4 outline-none focus:ring-2 focus:ring-amber-500 transition-all" />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm">3</div>
                  <h2 className="text-2xl font-bold font-display uppercase tracking-tight">Método de Pago</h2>
                </div>
                <div className="p-6 rounded-2xl border-2 border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-zinc-950 rounded-lg shadow-sm">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">MercadoPago</p>
                      <p className="text-xs text-zinc-500">Tarjetas de Crédito, Débito y Efectivo</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-4 border-zinc-900 dark:border-white bg-white dark:bg-zinc-950 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" />
                  </div>
                </div>
              </section>
            </form>
          </div>

          {/* Resumen Derecho */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 glass rounded-3xl p-8 shadow-2xl shadow-zinc-200/50 dark:shadow-none">
              <h2 className="text-xl font-bold font-display uppercase tracking-tight mb-8">Tu Pedido</h2>
              
              <ul className="space-y-6 mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-8 max-h-[35vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <div className="relative h-24 w-20 flex-shrink-0 bg-zinc-100 rounded-xl overflow-hidden">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 w-6 h-6 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-full flex items-center justify-center text-[10px] font-black z-10 border-2 border-white dark:border-zinc-950">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-bold leading-tight uppercase">{item.name}</h3>
                      <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">{item.color} / Talla {item.size}</p>
                    </div>
                    <div className="text-sm font-bold flex items-center">
                      ${(item.price * Number(item.quantity)).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 uppercase tracking-widest font-bold text-[10px]">Subtotal</span>
                  <span className="font-bold">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 uppercase tracking-widest font-bold text-[10px]">Envío</span>
                  <span className="font-bold">
                    {shipping === 0 ? (subtotal > 150000 ? 'GRATIS' : '$0') : `$${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-end">
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Total Final</span>
                  <span className="text-3xl font-bold tracking-tighter font-display">${total.toLocaleString()}</span>
                </div>
              </div>

              <button
                form="checkout-form"
                type="submit"
                disabled={isProcessing}
                className={`
                  premium-button w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-zinc-200 dark:shadow-none
                  ${isProcessing 
                    ? 'bg-zinc-200 text-zinc-500 cursor-wait' 
                    : 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:scale-[1.02]'}
                `}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-100 rounded-full animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Confirmar y Pagar
                  </>
                )}
              </button>

              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Compra Protegida
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                  <Truck className="h-4 w-4 text-amber-500" /> Envío Asegurado
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { ShoppingBag } from 'lucide-react'
