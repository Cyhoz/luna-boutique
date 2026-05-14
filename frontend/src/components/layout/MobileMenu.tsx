'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldCheck, Globe, Send, Mail, Moon } from 'lucide-react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  isAdmin: boolean
}

export function MobileMenu({ isOpen, onClose, isAdmin }: MobileMenuProps) {
  // Bloquear scroll del cuerpo
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.height = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.height = 'unset'
    }
  }, [isOpen])

  const menuItems = [
    { name: 'Colección', href: '/coleccion' },
    { name: 'Novedades', href: '/novedades' },
    { name: 'Archivo', href: '/ofertas' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          {/* Backdrop - Usamos el color base del tema con blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#3b1a5a]/60 backdrop-blur-2xl"
          />

          {/* Drawer - Con el fondo mágico de la página principal */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className="absolute inset-y-0 left-0 w-full sm:w-[450px] shadow-[20px_0_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            {/* Fondo Mágico Animado para el Drawer */}
            <div className="absolute inset-0 magical-bg z-[-1] opacity-95" />
            <div className="absolute inset-0 bg-black/20 z-[-1]" /> {/* Sutil oscurecido para legibilidad */}

            <div className="flex flex-col h-full p-10 relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-16">
                <div className="flex items-center gap-2 group">
                  <span className="text-3xl font-serif font-black tracking-widest text-white">LUNA</span>
                  <span className="text-3xl font-serif font-black tracking-widest gold-text italic">BOUTIQUE</span>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-4 bg-white/10 rounded-full text-white/80 hover:text-white transition-all active:scale-90 border border-white/10"
                >
                  <X className="h-7 w-7" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 flex flex-col justify-center">
                <ul className="space-y-12">
                  {menuItems.map((item, idx) => (
                    <motion.li 
                      key={item.name}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * (idx + 1) }}
                    >
                      <Link 
                        href={item.href} 
                        onClick={onClose}
                        className="group flex items-center gap-6"
                      >
                        <span className="text-5xl sm:text-6xl font-serif font-medium text-white group-hover:italic group-hover:gold-text transition-all duration-500">
                          {item.name}
                        </span>
                        <div className="h-px flex-1 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                      </Link>
                    </motion.li>
                  ))}
                  
                  {isAdmin && (
                    <motion.li
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Link 
                        href="/admin" 
                        onClick={onClose}
                        className="inline-flex items-center gap-3 text-[10px] font-sans font-black text-white uppercase tracking-[0.4em] bg-white/10 py-5 px-8 rounded-full border border-white/20 hover:bg-white/20 transition-all mt-8 group"
                      >
                        <ShieldCheck className="h-4 w-4 text-[#f6ca56] group-hover:scale-110 transition-transform" />
                        Acceso Administración
                      </Link>
                    </motion.li>
                  )}
                </ul>
              </nav>

              {/* Footer Links */}
              <div className="mt-auto pt-10 border-t border-white/10 flex flex-col gap-8">
                <div className="flex gap-10 text-white/40">
                  <Globe className="h-6 w-6 hover:text-[#f6ca56] transition-colors cursor-pointer" />
                  <Send className="h-6 w-6 hover:text-[#e52b82] transition-colors cursor-pointer" />
                  <Mail className="h-6 w-6 hover:text-[#f6ca56] transition-colors cursor-pointer" />
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] text-white/30 font-black tracking-[0.6em] uppercase">
                    Luna Boutique Est. 2026
                  </p>
                  <p className="text-sm font-serif italic text-white/60">
                    Redefiniendo el lujo atemporal.
                  </p>
                </div>
              </div>

              {/* Decorative subtle glow */}
              <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#f6ca56]/[0.05] rounded-full blur-[100px] pointer-events-none" />
            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  )
}
