'use client'

import Link from 'next/link'
import { ShoppingBag, Search, Menu, User, ShieldCheck, X, Moon, Stars, Sparkles } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { MobileMenu } from './MobileMenu'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  const { toggleCart, items } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  useEffect(() => {
    setMounted(true)

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profile } = await supabase
          .from('cliente')
          .select('role')
          .eq('id_cliente', user.id)
          .single()
        
        setIsAdmin(profile?.role === 'admin')
      } else {
        setIsAdmin(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (event === 'SIGNED_IN') {
        checkUser()
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
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-zinc-950/40 backdrop-blur-2xl transition-all duration-500">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex h-20 items-center justify-between">

            {/* Left: Menu & Logo */}
            <div className="flex items-center gap-16">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 md:hidden text-zinc-500 hover:text-white transition-all"
              >
                <Menu className="h-6 w-6" />
              </button>

              <Link href="/" className="group flex items-center gap-4">
                <div className="relative">
                  <Moon className="h-7 w-7 text-[#eab308] transition-transform duration-700 group-hover:rotate-[360deg] pink-glow" />
                  <Stars className="absolute -top-1 -right-1 h-3 w-3 text-white/40 animate-twinkle" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-serif font-medium tracking-tighter text-white leading-none">
                    LUNA <span className="gold-text italic">BOUTIQUE</span>
                  </span>
                  <span className="text-[8px] font-black tracking-[0.6em] text-[#db2777] uppercase mt-1 opacity-80">Ethereal Luxury</span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-10">
                <Link href="/coleccion" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all">
                  Galería
                </Link>
                <Link href="/novedades" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all">
                  Firmamento
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#eab308] hover:scale-105 transition-all flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5" /> Command
                  </Link>
                )}
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-6">
              
              {/* Search */}
              <div className="relative flex items-center">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 280, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden hidden lg:block"
                    >
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="BUSCAR EN EL UNIVERSO..."
                        className="w-full glass bg-white/5 border-white/10 rounded-full py-2.5 pl-5 pr-12 text-[10px] font-black tracking-widest text-white outline-none placeholder:text-zinc-700"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-3 glass rounded-full border-white/5 text-zinc-500 hover:text-white transition-all"
                >
                  {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                </button>
              </div>

              {/* Account */}
              {/* Account */}
              <Link href="/mi-cuenta" className="p-3 glass rounded-full border-white/5 text-zinc-500 hover:text-[#eab308] transition-all relative group">
                <User className="h-4 w-4" />
                {mounted && user && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#eab308] rounded-full border-2 border-zinc-950 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="p-3 glass rounded-full border-white/5 text-zinc-500 hover:text-[#db2777] transition-all relative group"
              >
                <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#db2777] text-[9px] font-black text-white pink-glow">
                    {itemCount}
                  </span>
                )}
              </button>

              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAdmin={isAdmin}
      />
    </>
  )
}
