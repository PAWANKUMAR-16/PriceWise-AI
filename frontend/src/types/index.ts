export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface DealScore {
  score: number // 0-100
  label?: 'Hot Deal' | 'Good Deal' | 'Fair Price' | 'Overpriced'
  discountPercentage?: number
  historicalAverage?: number
  historicalLowest?: number
  historicalHighest?: number
  historicalMin?: number
  historicalMax?: number
  historicalMedian?: number
  currentBestPrice?: number
  explanation?: string
  dataFreshness?: string
  priceDropAmount?: number
  verdict?: string
  reason?: string
}

export interface Product {
  id: string
  title: string
  brand: string
  model?: string
  category: string
  description?: string
  imageUrl?: string
  bestPrice: number
  originalPrice?: number
  currency: string
  dealScore?: DealScore
  retailerCount?: number
  rating?: number
  reviewCount?: number
  inStock?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Retailer {
  id: string
  name: string
  logoUrl?: string
  websiteUrl?: string
  rating?: number
  active: boolean
}

export interface Offer {
  id: string
  productId: string
  retailerId: string
  retailerName: string
  retailerLogo?: string
  title: string
  url: string
  price: number
  originalPrice?: number
  shippingCost: number
  totalPrice: number
  currency: string
  inStock: boolean
  availabilityStatus?: string
  condition?: 'NEW' | 'REFURBISHED' | 'USED'
  lastCheckedAt: string
}

export interface RetailerListing extends Offer {}

export interface PriceHistory {
  id: string
  productId: string
  retailerId?: string
  retailerName?: string
  retailerCode?: string
  price: number
  shippingCost?: number
  totalPrice?: number
  currency?: string
  recordedAt: string
  observedAt?: string
  sourceReference?: string
}

export interface PriceHistoryResponse {
  productId: number | string
  productTitle?: string
  currentBestPrice?: number
  historicalMin?: number
  historicalMax?: number
  historicalMedian?: number
  totalObservations?: number
  history: PriceHistory[]
}

export interface Watchlist {
  id: string
  userId: string
  productId: string
  product: Product
  targetPrice?: number
  currentPrice: number
  initialPrice: number
  alertEnabled: boolean
  createdAt: string
}

export interface PriceAlert {
  id: string
  userId: string
  productId: string
  productTitle?: string
  targetPrice: number
  currentPrice: number
  isTriggered: boolean
  triggeredAt?: string
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'PRICE_DROP' | 'BACK_IN_STOCK' | 'SYSTEM' | 'DEAL_ALERT'
  isRead: boolean
  linkUrl?: string
  createdAt: string
}

export interface IngestionRun {
  id: string
  providerName: string
  status: 'RUNNING' | 'SUCCESS' | 'FAILED' | 'PARTIAL'
  itemsScanned: number
  itemsUpdated: number
  itemsCreated: number
  errorsCount: number
  durationSeconds: number
  startedAt: string
  finishedAt?: string
}

export interface ProviderHealth {
  id: string
  name: string
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN'
  lastSyncTime: string
  latencyMs: number
  successRate: number
  errorRate: number
  totalProducts: number
}

export interface ChatMessageSource {
  productId?: string
  title: string
  url?: string
  price?: number
  retailer?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  mode?: 'chat' | 'compare' | 'recommendations'
  sources?: ChatMessageSource[]
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  isFirst?: boolean
  isLast?: boolean
}

export interface ProductFilters {
  query?: string
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price_asc' | 'price_desc' | 'deal_score' | 'newest'
  inStockOnly?: boolean
  page?: number
  size?: number
}
