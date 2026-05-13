'use client'

import { useEffect, useRef } from 'react'
import { useCartStore, CartItem } from '@/store/cartStore'
import { syncCartToDB, loadCartFromDB } from '@/services/cartService'
import { createClient } from '@/lib/supabase/client'

export function CartSync() {
  const { items, addItem, clearCart } = useCartStore()
  const isFirstRender = useRef(true)
  const supabase = createClient()

  // 1. Cargar el carrito de la DB al iniciar sesión
  useEffect(() => {
    const initCart = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const dbItems = await loadCartFromDB(user.id)
        if (dbItems && dbItems.length > 0) {
          // Si el carrito local está vacío, cargamos el de la DB
          if (items.length === 0) {
            dbItems.forEach(item => addItem(item))
          } else {
            // Lógica de merge (opcional): Añadir solo los que no están
            // Por simplicidad en esta boutique, si hay locales, los respetamos
          }
        }
      }
    }
    initCart()
  }, []) // Solo al montar el componente (inicio de sesión)

  // 2. Sincronizar cambios locales hacia la DB
  useEffect(() => {
    const sync = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        if (isFirstRender.current) {
          isFirstRender.current = false
          return
        }

        await syncCartToDB(user.id, items)
      }
      isFirstRender.current = false
    }

    const timeoutId = setTimeout(sync, 1500) // Debounce más largo para ahorrar DB
    return () => clearTimeout(timeoutId)
  }, [items, supabase])

  return null
}
