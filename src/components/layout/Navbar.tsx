'use client'

import Link from 'next/link'
import { ShoppingBag, Search, Menu, User, ShieldCheck, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { MobileMenu } from './MobileMenu'
import { AdminNotifications } from './AdminNotifications'

export function Navbar() {
  const { toggleCart, items } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  useEffect(() => {
    setMounted(true)

    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        setIsAdmin(profile?.role === 'admin')
      } else {
        setIsAdmin(false)
      }
    }

    checkAdmin()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        checkAdmin()
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const itemCount = items.reduce((total, item) => total + Number(item.quantity), 0)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/80 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/80 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Left: Mobile Menu Toggle & Logo */}
          <div className="flex items-center gap-12">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 mr-2 md:hidden text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </button>
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-3xl font-serif font-black tracking-widest text-primary group-hover:text-accent transition-colors">
                LUNA
              </span>
              <span className="text-[10px] font-sans font-bold tracking-[0.4em] opacity-40 uppercase pt-1">Boutique</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/coleccion" className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
                Colección
              </Link>
              <Link href="/novedades" className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
                Novedades
              </Link>
              <Link href="/ofertas" className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-red-400 hover:text-red-500 transition-colors">
                Ofertas
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Search Toggle */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden hidden sm:block"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Buscar productos..."
                      className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-full py-1.5 pl-4 pr-10 text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 relative z-10 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
              >
                {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                <span className="sr-only">Buscar</span>
              </button>
            </div>

            {/* Admin Notifications Trigger */}
            {mounted && isAdmin && <AdminNotifications />}

            <Link href="/mi-cuenta" className="p-2 hidden sm:block text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
              <User className="h-5 w-5" />
              <span className="sr-only">Cuenta</span>
            </Link>

            <button
              onClick={toggleCart}
              className="p-2 relative group text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
            >
              <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {mounted && itemCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[9px] font-bold text-white dark:bg-white dark:text-zinc-900 ring-2 ring-white dark:ring-zinc-950">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Carrito</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Component */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAdmin={isAdmin}
      />
    </nav>
  )
}
