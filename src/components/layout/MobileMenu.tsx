'use client'

import { useState, useEffect } from 'react'
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-primary/40 backdrop-blur-md lg:hidden"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-[100] w-full sm:w-[85%] max-w-sm bg-white dark:bg-[#020617] p-10 shadow-3xl lg:hidden flex flex-col border-r border-primary/5"
          >
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-serif font-black tracking-widest text-primary">LUNA</span>
                <Moon className="h-4 w-4 text-accent" />
              </div>
              <button onClick={onClose} className="p-2 text-primary/40 hover:text-primary">
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1">
              <ul className="space-y-8">
                {menuItems.map((item, idx) => (
                  <motion.li 
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                  >
                    <Link 
                      href={item.href} 
                      onClick={onClose}
                      className="text-4xl font-serif font-medium tracking-tight hover:text-accent transition-colors block"
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
                
                {isAdmin && (
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link 
                      href="/admin" 
                      onClick={onClose}
                      className="text-xl font-sans font-bold text-accent flex items-center gap-2 mt-10 uppercase tracking-widest"
                    >
                      <ShieldCheck className="h-5 w-5" />
                      Administración
                    </Link>
                  </motion.li>
                )}
              </ul>
            </nav>

            <div className="mt-auto pt-10 border-t border-primary/5">
              <div className="flex gap-6 mb-8 text-primary/40">
                <Globe className="h-5 w-5" />
                <Send className="h-5 w-5" />
                <Mail className="h-5 w-5" />
              </div>
              <p className="text-[10px] text-primary/30 font-black tracking-[0.4em] uppercase">
                Estilo Atemporal.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
