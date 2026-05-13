'use client'

import { Fragment, useEffect, useState } from 'react'
import { X, Trash2, ShoppingBag, Plus, Minus, Moon, Stars } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice } from '@/utils/formatters'

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, getTotal } = useCartStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay - Deep Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-zinc-950/80 backdrop-blur-md transition-opacity"
            onClick={toggleCart}
          />

          {/* Drawer - Luxury Glass */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[70] w-full max-w-lg glass-light shadow-[0_0_100px_rgba(0,0,0,0.8)] border-l border-white/5"
          >
            <div className="flex h-full flex-col lunar-gradient relative">
              {/* Decorative Stars */}
              <Stars className="absolute top-20 right-10 h-4 w-4 text-white/5 animate-twinkle" />
              <Moon className="absolute bottom-40 left-10 h-6 w-6 text-white/5 animate-float" />

              {/* Header - Elegant */}
              <div className="flex items-center justify-between border-b border-white/5 px-8 py-10">
                <div className="space-y-1">
                  <h2 className="text-3xl font-serif font-medium text-white italic">Tu Selección</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">{items.length} PIEZAS ENCONTRADAS</p>
                </div>
                <button
                  onClick={toggleCart}
                  className="p-3 glass rounded-full text-zinc-500 hover:text-white hover:border-white/20 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Items - Scrollable Gallery */}
              <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center space-y-8 text-center">
                    <div className="w-24 h-24 glass rounded-full flex items-center justify-center border-white/5">
                      <ShoppingBag className="w-8 h-8 text-zinc-700" />
                    </div>
                    <div className="space-y-4">
                      <p className="text-xl font-serif text-zinc-500 italic">El firmamento está despejado...</p>
                      <button 
                        onClick={toggleCart}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-[#eab308] border-b border-[#eab308]/20 pb-1"
                      >
                        Descubrir la Colección
                      </button>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-12">
                    {items.map((item, index) => (
                      <motion.li 
                        layout
                        key={`${item.id}-${index}`} 
                        className="flex gap-8 group"
                      >
                        <div className="h-32 w-28 flex-shrink-0 glass rounded-[2rem] overflow-hidden border-white/5 p-1 relative">
                          <div className="relative h-full w-full rounded-[1.5rem] overflow-hidden">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col justify-between py-1">
                          <div className="space-y-1">
                            <div className="flex justify-between items-start gap-4">
                              <h3 className="text-sm font-black text-white uppercase tracking-widest leading-tight">
                                <Link href={`/producto/${item.productId}`} onClick={toggleCart} className="hover:text-[#eab308] transition-colors">
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="text-sm font-serif gold-text">${formatPrice(item.price * Number(item.quantity))}</p>
                            </div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                              {item.color} / {item.size}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center glass rounded-xl border-white/5 p-1">
                              <button 
                                className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                                onClick={() => updateQuantity(item.id, Math.max(1, Number(item.quantity) - 1))}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-10 text-center text-xs font-black text-white">
                                {item.quantity}
                              </span>
                              <button 
                                className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                                onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="w-10 h-10 glass rounded-xl flex items-center justify-center text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer - Checkout Action */}
              {items.length > 0 && (
                <div className="glass px-10 py-12 border-t border-white/10 space-y-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Subtotal</span>
                      <span className="text-xl font-serif text-white">${formatPrice(getTotal())}</span>
                    </div>
                    <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest text-center">
                      Envío boutique incluido en compras superiores a $150,000
                    </p>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={toggleCart}
                    className="flex items-center justify-center w-full h-20 rounded-[2rem] bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:bg-[#eab308] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500"
                  >
                    Proceder al Pago
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
