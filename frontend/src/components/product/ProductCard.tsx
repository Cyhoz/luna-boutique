'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { Plus, Sparkles } from 'lucide-react'
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
}

export function ProductCard({ id, productId, name, price, originalPrice, imageUrl, category, isNew, isOnSale, stock = 0 }: ProductCardProps) {
  const { addItem } = useCartStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (stock <= 0) {
      alert("Este producto no tiene stock disponible para compra rápida.")
      return
    }
    addItem({
      id: id,
      productId: productId || id,
      name,
      price,
      size: 'M',
      color: 'Único',
      quantity: 1,
      imageUrl,
      stock
    })
  }

  const hasOffer = isOnSale || (originalPrice && originalPrice > price)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col gap-y-6"
    >
      <Link href={`/producto/${id}`} className="lunar-glow relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/5 block">
        <div className="absolute left-6 top-6 z-10 flex flex-col gap-2">
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
        </div>
        
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover object-center transition-transform duration-1000 group-hover:scale-105 brightness-[0.9]"
        />
        
        {/* Soft Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f051d]/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* Quick Action Button - Minimalist */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button 
            onClick={handleAddToCart}
            className="flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[#0f051d] shadow-2xl hover:scale-105 transition-transform"
          >
            <Plus className="h-4 w-4" /> Añadir
          </button>
        </div>
      </Link>

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
