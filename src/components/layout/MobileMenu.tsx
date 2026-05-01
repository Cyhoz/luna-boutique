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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
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
        <>
          {/* Backdrop Ultra Dark */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-[#020617]/90 backdrop-blur-md lg:hidden"
          />

          {/* Elegant Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-[120] w-full sm:w-[400px] bg-[#0f172a] p-10 shadow-3xl lg:hidden flex flex-col border-r border-white/5"
          >
            {/* Header in Menu */}
            <div className="flex items-center justify-between mb-20">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-serif font-black tracking-widest text-[#f8fafc]">LUNA</span>
                <Moon className="h-4 w-4 text-[#e2e8f0]" />
              </div>
              <button 
                onClick={onClose} 
                className="p-3 bg-white/5 rounded-full text-[#f8fafc]/40 hover:text-[#f8fafc] transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1">
              <ul className="space-y-10">
                {menuItems.map((item, idx) => (
                  <motion.li 
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * (idx + 1) }}
                  >
                    <Link 
                      href={item.href} 
                      onClick={onClose}
                      className="group flex items-center justify-between"
                    >
                      <span className="text-5xl font-serif font-medium text-[#f8fafc] group-hover:italic group-hover:text-[#e2e8f0] transition-all">
                        {item.name}
                      </span>
                      <div className="h-1 w-0 bg-[#e2e8f0] transition-all group-hover:w-8" />
                    </Link>
                  </motion.li>
                ))}
                
                {isAdmin && (
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link 
                      href="/admin" 
                      onClick={onClose}
                      className="text-xs font-sans font-black text-[#e2e8f0] flex items-center gap-2 mt-12 uppercase tracking-[0.3em] bg-white/5 py-4 px-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Administración
                    </Link>
                  </motion.li>
                )}
              </ul>
            </nav>

            {/* Footer in Menu */}
            <div className="mt-auto pt-10 border-t border-white/5">
              <div className="flex gap-8 mb-8 text-[#f8fafc]/30">
                <Globe className="h-5 w-5 hover:text-[#f8fafc] transition-colors" />
                <Send className="h-5 w-5 hover:text-[#f8fafc] transition-colors" />
                <Mail className="h-5 w-5 hover:text-[#f8fafc] transition-colors" />
              </div>
              <div className="space-y-2">
                <p className="text-[9px] text-[#f8fafc]/20 font-black tracking-[0.5em] uppercase">
                  Luna Boutique © 2026
                </p>
                <p className="text-[11px] font-serif italic text-[#f8fafc]/40">
                  La elegancia nace de la esencia.
                </p>
              </div>
            </div>

            {/* Decorative background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
