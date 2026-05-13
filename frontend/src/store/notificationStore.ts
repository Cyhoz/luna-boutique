import { create } from 'zustand'

type NotificationType = 'success' | 'error' | 'info'

interface Notification {
  id: string
  message: string
  type: NotificationType
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (message: string, type: NotificationType) => void
  removeNotification: (id: string) => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (message, type) => {
    const id = Math.random().toString(36).substring(7)
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }]
    }))

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }))
    }, 5000)
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }))
  }
}))
