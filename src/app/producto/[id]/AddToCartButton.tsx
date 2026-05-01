'use client'

import { useState } from 'react'
import { ShoppingBag, Check, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { motion, AnimatePresence } from 'framer-motion'

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    imageUrl: string
  }
  variants: any[]
  sizes: string[]
  colors: string[]
}

export function AddToCartButton({ product, variants, sizes, colors }: AddToCartButtonProps) {
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || '')
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || '')
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  // Encontrar la variante específica seleccionada
  const selectedVariant = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  )

  const isOutOfStock = selectedVariant ? selectedVariant.stock_quantity <= 0 : true

  const handleAddToCart = () => {
    if (isOutOfStock) return

    addItem({
      id: selectedVariant.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      imageUrl: product.imageUrl,
      quantity: 1
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Selector de Tallas */}
      {sizes.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Seleccionar Talla</h3>
            <span className="text-[10px] font-bold text-zinc-400">Standard Fit</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => {
              const isAvailable = variants.some(v => v.size === size && v.stock_quantity > 0)
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`
                    min-w-[56px] h-12 rounded-xl border-2 text-sm font-bold transition-all duration-300
                    ${selectedSize === size 
                      ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950' 
                      : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600'}
                    ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Selector de Color (Solo si hay más de uno) */}
      {colors.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Color: {selectedColor}</h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`
                  px-4 h-10 rounded-full border-2 text-xs font-bold transition-all
                  ${selectedColor === color 
                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950 shadow-lg' 
                    : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600'}
                `}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {isOutOfStock ? (
          <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold uppercase tracking-widest bg-red-500/5 px-3 py-1 rounded-full border border-red-500/20">
            <AlertCircle className="h-3.5 w-3.5" /> Agotado
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold uppercase tracking-widest bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            En Stock
          </div>
        )}
      </div>

      {/* Botón Principal */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`
          premium-button w-full h-16 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all
          ${isOutOfStock 
            ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-900' 
            : 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:shadow-2xl hover:shadow-amber-500/20 active:scale-[0.98]'}
        `}
      >
        <AnimatePresence mode="wait">
          {isAdded ? (
            <motion.span
              key="added"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Check className="h-5 w-5" /> Añadido
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" /> Añadir al Carrito
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}
