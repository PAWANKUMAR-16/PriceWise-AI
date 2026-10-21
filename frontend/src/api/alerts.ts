import apiClient from './client'
import { Notification, PriceAlert } from '../types'

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'usr-1',
    title: 'Price Drop Alert!',
    message: 'Sony WH-1000XM5 dropped to ₹26,990 on Amazon India (Save ₹8,000)!',
    type: 'PRICE_DROP',
    isRead: false,
    linkUrl: '/products/prod-3',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'usr-1',
    title: 'New Deal Score: 88 (Hot Deal)',
    message: 'Apple MacBook Air 15" M3 has reached a new record low across retailers.',
    type: 'DEAL_ALERT',
    isRead: false,
    linkUrl: '/products/prod-1',
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
  {
    id: 'notif-3',
    userId: 'usr-1',
    title: 'Weekly Savings Summary',
    message: '3 items on your watchlist had active price movements this week.',
    type: 'SYSTEM',
    isRead: true,
    linkUrl: '/watchlist',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
]

export const alertsApi = {
  async getAlerts(): Promise<PriceAlert[]> {
    try {
      const response = await apiClient.get<PriceAlert[]>('/alerts')
      return response.data
    } catch {
      return [
        {
          id: 'alt-1',
          userId: 'usr-1',
          productId: 'prod-1',
          productTitle: 'Apple MacBook Air 15" M3 Chip',
          targetPrice: 130000,
          currentPrice: 134900,
          isTriggered: false,
          createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        },
      ]
    }
  },

  async createAlert(productId: string, targetPrice: number): Promise<PriceAlert> {
    try {
      const response = await apiClient.post<PriceAlert>('/alerts', { productId, targetPrice })
      return response.data
    } catch {
      return {
        id: 'alt-' + Date.now(),
        userId: 'usr-1',
        productId,
        targetPrice,
        currentPrice: targetPrice * 1.05,
        isTriggered: false,
        createdAt: new Date().toISOString(),
      }
    }
  },

  async deleteAlert(alertId: string): Promise<void> {
    try {
      await apiClient.delete(`/alerts/${alertId}`)
    } catch {
      // ignore
    }
  },

  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await apiClient.get<Notification[]>('/notifications')
      return response.data
    } catch {
      return MOCK_NOTIFICATIONS
    }
  },

  async markNotificationAsRead(id: string): Promise<void> {
    try {
      await apiClient.patch(`/notifications/${id}/read`)
    } catch {
      const target = MOCK_NOTIFICATIONS.find((n) => n.id === id)
      if (target) target.isRead = true
    }
  },

  async markAllNotificationsAsRead(): Promise<void> {
    try {
      await apiClient.post('/notifications/mark-all-read')
    } catch {
      MOCK_NOTIFICATIONS.forEach((n) => (n.isRead = true))
    }
  },
}
