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
  stock: number
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
          const newQuantity = Number(existingItem.quantity) + Number(item.quantity)
          // Validar stock
          if (newQuantity > item.stock) {
            alert(`Lo sentimos, solo quedan ${item.stock} unidades disponibles.`)
            return
          }

          set({
            items: currentItems.map((i) =>
              i.id === item.id
                ? { ...i, quantity: newQuantity }
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
      updateQuantity: (id, quantity) => {
        const item = get().items.find(i => i.id === id)
        if (item && quantity > item.stock) {
          alert(`Límite de stock alcanzado (${item.stock} disponibles)`)
          return
        }
        
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }))
      },
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
