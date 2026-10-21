import apiClient from './client'
import { Watchlist } from '../types'
import { MOCK_PRODUCTS } from './products'

const LOCAL_STORAGE_WATCHLIST_KEY = 'pricewise_mock_watchlist'

function getLocalWatchlist(): Watchlist[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_WATCHLIST_KEY)
    if (data) return JSON.parse(data)
  } catch {
    // ignore
  }
  // Initial default mock items
  const initial: Watchlist[] = [
    {
      id: 'wl-1',
      userId: 'usr-1',
      productId: 'prod-1',
      product: MOCK_PRODUCTS[0],
      targetPrice: 130000,
      currentPrice: 134900,
      initialPrice: 144900,
      alertEnabled: true,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: 'wl-2',
      userId: 'usr-1',
      productId: 'prod-3',
      product: MOCK_PRODUCTS[2],
      targetPrice: 25000,
      currentPrice: 26990,
      initialPrice: 29990,
      alertEnabled: true,
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    },
  ]
  localStorage.setItem(LOCAL_STORAGE_WATCHLIST_KEY, JSON.stringify(initial))
  return initial
}

function saveLocalWatchlist(list: Watchlist[]) {
  localStorage.setItem(LOCAL_STORAGE_WATCHLIST_KEY, JSON.stringify(list))
}

export const watchlistApi = {
  async getWatchlist(): Promise<Watchlist[]> {
    try {
      const response = await apiClient.get<Watchlist[]>('/watchlist')
      return response.data
    } catch {
      return getLocalWatchlist()
    }
  },

  async addToWatchlist(productId: string, targetPrice?: number): Promise<Watchlist> {
    try {
      const response = await apiClient.post<Watchlist>('/watchlist', { productId, targetPrice })
      return response.data
    } catch {
      const current = getLocalWatchlist()
      const existing = current.find((item) => item.productId === productId)
      if (existing) {
        existing.targetPrice = targetPrice ?? existing.targetPrice
        saveLocalWatchlist(current)
        return existing
      }
      const product = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0]
      const newItem: Watchlist = {
        id: 'wl-' + Date.now(),
        userId: 'usr-1',
        productId,
        product,
        targetPrice: targetPrice ?? Math.round(product.bestPrice * 0.95),
        currentPrice: product.bestPrice,
        initialPrice: product.bestPrice,
        alertEnabled: true,
        createdAt: new Date().toISOString(),
      }
      current.push(newItem)
      saveLocalWatchlist(current)
      return newItem
    }
  },

  async updateWatchlist(watchlistId: string, targetPrice?: number, alertEnabled?: boolean): Promise<Watchlist> {
    try {
      const response = await apiClient.patch<Watchlist>(`/watchlist/${watchlistId}`, {
        targetPrice,
        alertEnabled,
      })
      return response.data
    } catch {
      const current = getLocalWatchlist()
      const item = current.find((w) => w.id === watchlistId)
      if (!item) throw new Error('Watchlist item not found')
      if (targetPrice !== undefined) item.targetPrice = targetPrice
      if (alertEnabled !== undefined) item.alertEnabled = alertEnabled
      saveLocalWatchlist(current)
      return item
    }
  },

  async removeFromWatchlist(watchlistId: string): Promise<void> {
    try {
      await apiClient.delete(`/watchlist/${watchlistId}`)
    } catch {
      const current = getLocalWatchlist().filter((w) => w.id !== watchlistId && w.productId !== watchlistId)
      saveLocalWatchlist(current)
    }
  },
}
