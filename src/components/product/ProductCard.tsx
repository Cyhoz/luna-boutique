'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { Plus, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  imageUrl: string
  category: string
  isNew?: boolean
  isOnSale?: boolean
}

export function ProductCard({ id, name, price, originalPrice, imageUrl, category, isNew, isOnSale }: ProductCardProps) {
  const { addItem } = useCartStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: `${id}-default`,
      productId: id,
      name,
      price,
      size: 'M',
      color: 'Único',
      quantity: 1,
      imageUrl
    })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col gap-y-6"
    >
      <Link href={`/producto/${id}`} className="lunar-glow relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] bg-muted block">
        <div className="absolute left-6 top-6 z-10 flex flex-col gap-2">
          {isNew && (
            <span className="rounded-full bg-white/80 backdrop-blur-md px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-primary shadow-sm">
              NEW DROP
            </span>
          )}
          {isOnSale && (
            <span className="rounded-full bg-primary/90 backdrop-blur-md px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-primary-foreground shadow-sm">
              EXCLUSIVE
            </span>
          )}
        </div>
        
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
        />
        
        {/* Soft Overlay */}
        <div className="absolute inset-0 bg-primary/0 transition-colors duration-700 group-hover:bg-primary/5" />
        
        {/* Quick Action Button - Minimalist */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button 
            onClick={handleAddToCart}
            className="flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-2xl hover:scale-105 transition-transform"
          >
            <Plus className="h-4 w-4" /> Quick View
          </button>
        </div>
      </Link>

      <div className="flex flex-col gap-3 px-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-accent" /> {category}
            </span>
            <h3 className="text-xl font-serif font-medium text-primary leading-tight transition-colors group-hover:text-accent">
              <Link href={`/producto/${id}`}>
                {name}
              </Link>
            </h3>
          </div>
          <div className="flex flex-col items-end pt-1">
            {isOnSale && originalPrice && (
              <span className="text-[10px] font-bold text-muted-foreground line-through mb-1">
                ${originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-sm font-bold tracking-tight text-primary">
              ${price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
