import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  items: string[] // Array of product IDs
  toggleItem: (productId: string) => void
  hasItem: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (productId) => {
        const { items } = get()
        if (items.includes(productId)) {
          set({ items: items.filter((id) => id !== productId) })
        } else {
          set({ items: [...items, productId] })
        }
      },
      hasItem: (productId) => get().items.includes(productId),
    }),
    {
      name: 'wishlist-storage',
    }
  )
)
