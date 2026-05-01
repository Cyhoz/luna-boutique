'use client'

import { Fragment, useEffect, useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, getTotal } = useCartStore()
  const [isMounted, setIsMounted] = useState(false)

  // Prevenir hidratación incorrecta por el persist de zustand
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={toggleCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform bg-white dark:bg-zinc-950 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 py-4 sm:px-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Tu Carrito</h2>
            <button
              onClick={toggleCart}
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              <span className="sr-only">Cerrar panel</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-4">
                <span className="text-4xl">🛍️</span>
                <p className="text-zinc-500 dark:text-zinc-400">Tu carrito está vacío</p>
                <button 
                  onClick={toggleCart}
                  className="mt-4 rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors"
                >
                  Seguir Comprando
                </button>
              </div>
            ) : (
              <ul className="space-y-6">
                {items.map((item) => (
                  <li key={item.id} className="flex py-2">
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800 relative">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-sm font-medium text-zinc-900 dark:text-white">
                          <h3 className="line-clamp-2">
                            <Link href={`/producto/${item.productId}`} onClick={toggleCart}>
                              {item.name}
                            </Link>
                          </h3>
                          <p className="ml-4 whitespace-nowrap">${(item.price * Number(item.quantity)).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          {item.color} | Talla: {item.size}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center rounded-md border border-zinc-200 dark:border-zinc-800">
                          <button 
                            className="px-2 py-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                            onClick={() => updateQuantity(item.id, Math.max(1, Number(item.quantity) - 1))}
                          >
                            -
                          </button>
                          <span className="px-2 py-1 text-zinc-900 dark:text-white font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            className="px-2 py-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                            onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="font-medium text-red-500 hover:text-red-400 flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-6 sm:px-6">
              <div className="flex justify-between text-base font-medium text-zinc-900 dark:text-white">
                <p>Subtotal</p>
                <p>${getTotal().toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                Impuestos y envío calculados en el checkout.
              </p>
              <div className="mt-6">
                <Link
                  href="/checkout"
                  onClick={toggleCart}
                  className="flex items-center justify-center rounded-full border border-transparent bg-zinc-900 px-6 py-4 text-base font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors"
                >
                  Ir al Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
