import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  message: string
  duration: number
  createdAt: number
}

type NotificationPayload = Omit<NotificationItem, 'id' | 'createdAt'> & {
  duration?: number
}

const defaultDuration = 5000

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<NotificationItem[]>([])

  function add(notification: NotificationPayload) {
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : String(Date.now())

    const item: NotificationItem = {
      id,
      createdAt: Date.now(),
      ...notification,
      duration: notification.duration ?? defaultDuration,
    }

    notifications.value.push(item)

    if (item.duration > 0) {
      window.setTimeout(() => remove(id), item.duration)
    }

    return id
  }

  function remove(id: string) {
    notifications.value = notifications.value.filter((item) => item.id !== id)
  }

  function clear() {
    notifications.value = []
  }

  return {
    notifications,
    add,
    remove,
    clear,
  }
})
