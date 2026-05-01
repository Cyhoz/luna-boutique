'use client'

import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { motion } from 'framer-motion'

export function WishlistButton({ productId }: { productId: string }) {
  const { toggleItem, hasItem } = useWishlistStore()
  const active = hasItem(productId)

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.preventDefault()
        toggleItem(productId)
      }}
      className={`p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${
        active 
          ? 'bg-red-500 text-white border-red-500' 
          : 'bg-white/80 dark:bg-zinc-950/80 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-950'
      }`}
    >
      <Heart className={`h-5 w-5 ${active ? 'fill-current' : ''}`} />
    </motion.button>
  )
}
