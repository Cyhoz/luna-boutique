'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { Plus, Sparkles, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatPrice } from '@/utils/formatters'

interface ProductCardProps {
  id: string
  productId?: string
  name: string
  price: number
  originalPrice?: number
  imageUrl: string
  category: string
  isNew?: boolean
  isOnSale?: boolean
  stock?: number
  variants?: any[]
}

export function ProductCard({ id, productId, name, price, originalPrice, imageUrl, category, isNew, isOnSale, stock = 0, variants = [] }: ProductCardProps) {
  const { addItem } = useCartStore()
  const [showSizes, setShowSizes] = useState(false)

  const getStock = (v: any) => {
    if (!v?.inventario) return 0
    return Array.isArray(v.inventario) ? (v.inventario[0]?.stock_actual || 0) : (v.inventario.stock_actual || 0)
  }

  const handleAddToCart = (variant: any) => {
    const vStock = getStock(variant)
    if (vStock <= 0) return

    addItem({
      id: variant.id_variante,
      productId: productId || id,
      name,
      price,
      size: variant.talla,
      color: variant.color?.nombre || 'Único',
      quantity: 1,
      imageUrl,
      stock: vStock
    })
  }

  const hasOffer = isOnSale || (originalPrice && originalPrice > price)
  const availableVariants = variants.filter(v => getStock(v) > 0)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col gap-y-6"
    >
      <div className="lunar-glow relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/5 block">
        <Link href={`/producto/${id}`} className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-1000 group-hover:scale-105 brightness-[0.9]"
          />
        </Link>

        <div className="absolute left-6 top-6 z-10 flex flex-col gap-2 pointer-events-none">
          {isNew && (
            <span className="rounded-full bg-[#db2777] px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-white shadow-lg pink-glow">
              NEW DROP
            </span>
          )}
          {hasOffer && (
            <span className="rounded-full bg-[#eab308] px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#0f051d] shadow-lg">
              EXCLUSIVE
            </span>
          )}
          {stock <= 0 && (
            <span className="rounded-full bg-zinc-900/80 backdrop-blur-md px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 border border-white/5">
              SOLD OUT
            </span>
          )}
        </div>
        
        {/* Soft Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f051d]/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
        
        {/* Quick Action - Size Selector */}
        <div className="absolute bottom-8 left-0 right-0 px-6 z-20 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {!showSizes ? (
            <button 
              onClick={(e) => { e.preventDefault(); stock > 0 && setShowSizes(true); }}
              className={`w-full flex items-center justify-center gap-3 rounded-full py-4 text-[10px] font-black uppercase tracking-widest transition-all ${stock > 0 ? 'bg-white text-black hover:scale-105' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
            >
              <Plus className="h-4 w-4" /> {stock > 0 ? 'Añadir' : 'Agotado'}
            </button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-3 rounded-[2rem] border-white/10 flex flex-col gap-3 items-center shadow-2xl"
            >
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#eab308]">Escoge Talla</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {availableVariants.length > 0 ? (
                  availableVariants.map((v) => (
                    <button
                      key={v.id_variante}
                      onClick={(e) => { e.preventDefault(); handleAddToCart(v); setShowSizes(false); }}
                      className="h-10 min-w-[44px] px-3 rounded-xl bg-white/5 hover:bg-white text-zinc-300 hover:text-black text-[10px] font-black transition-all border border-white/10 flex items-center justify-center"
                    >
                      {v.talla}
                    </button>
                  ))
                ) : (
                  <p className="text-[9px] font-bold text-zinc-500 py-2 uppercase tracking-widest">Agotado</p>
                )}
                <button 
                  onClick={() => setShowSizes(false)}
                  className="h-10 w-10 rounded-xl bg-white/5 text-zinc-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-[#eab308]" /> {category}
            </span>
            <h3 className="text-xl font-serif font-medium text-white leading-tight transition-colors group-hover:text-[#db2777]">
              <Link href={`/producto/${id}`}>
                {name}
              </Link>
            </h3>
          </div>
          <div className="flex flex-col items-end pt-1">
            {hasOffer && originalPrice && (
              <span className="text-[10px] font-bold text-zinc-500 line-through mb-1">
                ${formatPrice(originalPrice)}
              </span>
            )}
            <span className={`text-sm font-bold tracking-tight ${hasOffer ? 'text-[#db2777]' : 'text-[#eab308]'}`}>
              ${formatPrice(price)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
