'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ShoppingBag, ArrowRight, Stars, Moon, Sparkles, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen lunar-gradient flex items-center justify-center px-6 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <Stars className="absolute top-20 left-20 text-white/10 animate-twinkle" />
        <Stars className="absolute bottom-40 right-20 text-white/5 animate-twinkle" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#db2777]/5 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full glass rounded-[4rem] border-white/5 p-12 md:p-20 text-center relative z-10 shadow-2xl"
      >
        <div className="relative mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
            className="w-32 h-32 bg-white text-black rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(255,255,255,0.3)]"
          >
            <CheckCircle2 className="w-16 h-16" />
          </motion.div>
          <Sparkles className="absolute -top-4 -right-4 text-[#eab308] animate-twinkle" />
        </div>

        <div className="space-y-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-serif font-medium text-white tracking-tighter italic">
            Gratitud <span className="gold-text">Eterna.</span>
          </h1>
          <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-md mx-auto font-medium">
            Tu selección ha sido registrada en el firmamento de Luna Boutique. Estamos preparando tu pieza con la dedicación que merece.
          </p>
        </div>

        {orderId && (
          <div className="glass-light rounded-3xl border-white/5 p-8 mb-16 inline-block mx-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-2">Identificador de Pedido</p>
            <p className="text-2xl font-serif gold-text tracking-widest">#{orderId.split('-')[0]}</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          <Link 
            href="/mi-cuenta" 
            className="group flex items-center justify-center gap-4 py-6 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#eab308] transition-all hover:scale-105"
          >
            Seguir Pedido
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/coleccion" 
            className="flex items-center justify-center gap-4 py-6 glass text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all border-white/5"
          >
            <ShoppingBag className="w-4 h-4" />
            Volver a la Tienda
          </Link>
        </div>

        <div className="mt-16 pt-10 border-t border-white/5 flex items-center justify-center gap-3">
          <Heart className="w-4 h-4 text-[#db2777] fill-[#db2777]/20" />
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-700">Hecho con Magia en Luna Boutique</p>
        </div>
      </motion.div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen lunar-gradient flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
