'use client'

import { useState } from 'react'
import { ShoppingBag, Check, AlertCircle, Stars } from 'lucide-react'
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
  colors: any[] // Ahora esperamos objetos de color con nombre y hex
}

export function AddToCartButton({ product, variants, sizes, colors }: AddToCartButtonProps) {
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || '')
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]?.nombre || '')
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  // Encontrar la variante específica seleccionada basada en talla y nombre del color
  const selectedVariant = variants.find(
    (v) => v.talla === selectedSize && v.color?.nombre === selectedColor
  )

  const stockActual = selectedVariant?.inventario?.stock_actual || 0
  const isOutOfStock = stockActual <= 0

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return

    addItem({
      id: selectedVariant.id_variante,
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      imageUrl: product.imageUrl,
      quantity: 1,
      stock: stockActual
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="space-y-10">
      {/* Selector de Tallas */}
      {sizes.length > 0 && (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Seleccionar Talla</h3>
            <button className="text-[10px] font-bold text-[#eab308] border-b border-[#eab308]/20 pb-0.5">Guía de Tallas</button>
          </div>
          <div className="flex flex-wrap gap-4">
            {sizes.map((size) => {
              const isAvailable = variants.some(v => v.talla === size && (v.inventario?.stock_actual || 0) > 0)
              const isSelected = selectedSize === size
              return (
                <button
                  key={size}
                  onClick={() => isAvailable && setSelectedSize(size)}
                  className={`
                    min-w-[64px] h-14 rounded-2xl border text-[12px] font-black transition-all duration-500
                    ${isSelected 
                      ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                      : 'bg-white/5 border-white/10 text-white hover:border-white/30'}
                    ${!isAvailable ? 'opacity-20 cursor-not-allowed grayscale' : ''}
                  `}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Selector de Color */}
      {colors.length > 0 && (
        <div className="space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Color: <span className="text-white">{selectedColor}</span></h3>
          <div className="flex flex-wrap gap-5">
            {colors.map((color) => {
              const isSelected = selectedColor === color.nombre
              return (
                <button
                  key={color.nombre}
                  onClick={() => setSelectedColor(color.nombre)}
                  className={`
                    group relative flex items-center justify-center
                    ${isSelected ? 'scale-110' : 'hover:scale-105'}
                    transition-all duration-500
                  `}
                  title={color.nombre}
                >
                  <div 
                    className="w-10 h-10 rounded-full border-2 border-white/10"
                    style={{ backgroundColor: color.codigo_hex }}
                  />
                  {isSelected && (
                    <motion.div 
                      layoutId="color-ring"
                      className="absolute -inset-2 rounded-full border border-[#eab308] pink-glow"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stock Status & Price Info */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-3">
          {isOutOfStock ? (
            <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest glass px-4 py-2 rounded-full border-red-500/20">
              <AlertCircle className="h-3.5 w-3.5" /> Agotado
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest glass px-4 py-2 rounded-full border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              En Stock ({stockActual} unidades)
            </div>
          )}
        </div>
      </div>

      {/* Botón Principal */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`
          relative w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[12px] flex items-center justify-center gap-4 transition-all duration-700
          ${isOutOfStock 
            ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5' 
            : 'bg-[#db2777] text-white shadow-[0_0_40px_rgba(219,39,119,0.3)] hover:scale-[1.02] hover:bg-pink-600 active:scale-[0.98]'}
        `}
      >
        <AnimatePresence mode="wait">
          {isAdded ? (
            <motion.div
              key="added"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex items-center gap-3"
            >
              <Check className="h-5 w-5" /> Añadido a la Bolsa
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex items-center gap-3"
            >
              <ShoppingBag className="h-5 w-5" /> {isOutOfStock ? 'No Disponible' : 'Adquirir Pieza'}
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isOutOfStock && <Stars className="absolute right-8 h-4 w-4 text-white/40 animate-twinkle" />}
      </button>
    </div>
  )
}
