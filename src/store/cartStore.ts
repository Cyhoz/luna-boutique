import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string // product_variant_id
  productId: string
  name: string
  price: number
  size: string
  color: string
  quantity: string | number
  imageUrl: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  toggleCart: () => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const currentItems = get().items
        const existingItem = currentItems.find((i) => i.id === item.id)

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id
                ? { ...i, quantity: Number(i.quantity) + Number(item.quantity) }
                : i
            ),
            isOpen: true,
          })
        } else {
          set({ items: [...currentItems, item], isOpen: true })
        }
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * Number(item.quantity),
          0
        )
      },
    }),
    {
      name: 'antigravity-cart',
    }
  )
)
