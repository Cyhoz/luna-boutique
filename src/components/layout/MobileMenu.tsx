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
          {/* Backdrop Sólido - No deja pasar NADA de luz */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020617] backdrop-blur-xl"
          />

          {/* Drawer Sólido y Elegante */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className="absolute inset-y-0 left-0 w-full sm:w-[450px] bg-[#0f172a] shadow-[20px_0_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            {/* Fondo decorativo interno para asegurar opacidad */}
            <div className="absolute inset-0 bg-[#0f172a] z-[-1]" />

            <div className="flex flex-col h-full p-10 relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-16">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-serif font-black tracking-widest text-white">LUNA</span>
                  <Moon className="h-4 w-4 text-[#e2e8f0]" />
                </div>
                <button 
                  onClick={onClose} 
                  className="p-4 bg-white/5 rounded-full text-white/60 hover:text-white transition-all active:scale-90"
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
                        <span className="text-5xl sm:text-6xl font-serif font-medium text-white group-hover:italic group-hover:text-[#e2e8f0] transition-all duration-500">
                          {item.name}
                        </span>
                        <div className="h-px flex-1 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
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
                        className="inline-flex items-center gap-3 text-[10px] font-sans font-black text-[#e2e8f0] uppercase tracking-[0.4em] bg-white/5 py-5 px-8 rounded-full border border-white/10 hover:bg-white/10 transition-all mt-8"
                      >
                        <ShieldCheck className="h-4 w-4 text-accent" />
                        Acceso Administración
                      </Link>
                    </motion.li>
                  )}
                </ul>
              </nav>

              {/* Footer Links */}
              <div className="mt-auto pt-10 border-t border-white/5 flex flex-col gap-8">
                <div className="flex gap-10 text-white/20">
                  <Globe className="h-6 w-6 hover:text-white transition-colors cursor-pointer" />
                  <Send className="h-6 w-6 hover:text-white transition-colors cursor-pointer" />
                  <Mail className="h-6 w-6 hover:text-white transition-colors cursor-pointer" />
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] text-white/10 font-black tracking-[0.6em] uppercase">
                    Luna Boutique Est. 2026
                  </p>
                  <p className="text-sm font-serif italic text-white/30">
                    Redefiniendo el lujo atemporal.
                  </p>
                </div>
              </div>

              {/* Decorative subtle glow */}
              <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
