import apiClient from './client'
import { DealScore, Offer, PagedResponse, PriceHistory, Product, ProductFilters } from '../types'
import { getProductImage } from '../utils/productImages'

// Realistic mock data for instant preview when backend is offline
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Apple MacBook Air 15" M3 Chip (16GB RAM, 512GB SSD) - Starlight',
    brand: 'Apple',
    model: 'MacBook Air M3',
    category: 'Laptops',
    description: 'Strikingly thin and fast with 18 hours of battery life. Liquid Retina display, 1080p FaceTime HD camera, MagSafe 3 charging.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    bestPrice: 134900,
    originalPrice: 154900,
    currency: 'INR',
    rating: 4.8,
    reviewCount: 342,
    retailerCount: 4,
    inStock: true,
    dealScore: {
      score: 88,
      label: 'Hot Deal',
      discountPercentage: 13,
      historicalAverage: 149900,
      historicalLowest: 134900,
      historicalHighest: 159900,
      priceDropAmount: 15000,
      verdict: 'All-time lowest price recorded! High discount compared to historical average.',
      reason: '13% drop within the last 48 hours across major retailers.',
    },
  },
  {
    id: 'prod-2',
    title: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB RAM, 256GB Storage)',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    category: 'Smartphones',
    description: 'Galaxy AI is here. Search like never before, get quick language translation, convert your voice note into text, then summarize it.',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    bestPrice: 119999,
    originalPrice: 129999,
    currency: 'INR',
    rating: 4.7,
    reviewCount: 520,
    retailerCount: 3,
    inStock: true,
    dealScore: {
      score: 76,
      label: 'Good Deal',
      discountPercentage: 8,
      historicalAverage: 124999,
      historicalLowest: 118499,
      historicalHighest: 134999,
      priceDropAmount: 5000,
      verdict: 'Great price within 1.2% of historical lowest.',
      reason: 'Steady price drop over the past 2 weeks.',
    },
  },
  {
    id: 'prod-3',
    title: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones',
    brand: 'Sony',
    model: 'WH-1000XM5',
    category: 'Accessories',
    description: 'Two processors and 8 microphones for unprecedented noise cancellation. Exceptional sound quality and ultra-clear hands-free calling.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    bestPrice: 26990,
    originalPrice: 34990,
    currency: 'INR',
    rating: 4.6,
    reviewCount: 1280,
    retailerCount: 5,
    inStock: true,
    dealScore: {
      score: 92,
      label: 'Hot Deal',
      discountPercentage: 23,
      historicalAverage: 29990,
      historicalLowest: 25990,
      historicalHighest: 34990,
      priceDropAmount: 8000,
      verdict: 'Exceptional 23% discount. Highly recommended buy now.',
      reason: 'Festive season price match across Amazon and Croma.',
    },
  },
  {
    id: 'prod-4',
    title: 'Apple iPad Air 11-inch (M2 Chip, Wi-Fi, 128GB) - Space Gray',
    brand: 'Apple',
    model: 'iPad Air 11 M2',
    category: 'Tablets',
    description: 'Supercharged by Apple M2 chip. 11-inch Liquid Retina display with True Tone. Works with Apple Pencil Pro and Magic Keyboard.',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    bestPrice: 55900,
    originalPrice: 59900,
    currency: 'INR',
    rating: 4.9,
    reviewCount: 189,
    retailerCount: 3,
    inStock: true,
    dealScore: {
      score: 68,
      label: 'Good Deal',
      discountPercentage: 7,
      historicalAverage: 58500,
      historicalLowest: 54900,
      historicalHighest: 59900,
      priceDropAmount: 4000,
      verdict: 'Solid savings on a current-generation Apple device.',
      reason: 'Moderate bank discount offers currently active.',
    },
  },
  {
    id: 'prod-5',
    title: 'Dell XPS 14 OLED Laptop (Intel Core Ultra 7, 32GB RAM, 1TB SSD, RTX 4050)',
    brand: 'Dell',
    model: 'XPS 14 9440',
    category: 'Laptops',
    description: 'Machined aluminum chassis, 3.2K OLED touch display, next-gen AI-accelerated Intel Core Ultra processor.',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    bestPrice: 189990,
    originalPrice: 219990,
    currency: 'INR',
    rating: 4.5,
    reviewCount: 94,
    retailerCount: 2,
    inStock: true,
    dealScore: {
      score: 84,
      label: 'Hot Deal',
      discountPercentage: 14,
      historicalAverage: 204990,
      historicalLowest: 189990,
      historicalHighest: 224990,
      priceDropAmount: 30000,
      verdict: 'Matches all-time low recorded during clearance sale.',
      reason: 'Direct manufacturer discount passed on to major retailers.',
    },
  },
  {
    id: 'prod-6',
    title: 'Apple iPhone 15 Pro (128 GB) - Natural Titanium',
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    category: 'Smartphones',
    description: 'Forged in titanium with the groundbreaking A17 Pro chip, customizable Action button, and 48MP main camera system.',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    bestPrice: 119900,
    originalPrice: 134900,
    currency: 'INR',
    rating: 4.8,
    reviewCount: 840,
    retailerCount: 4,
    inStock: true,
    dealScore: {
      score: 82,
      label: 'Hot Deal',
      discountPercentage: 11,
      historicalAverage: 129900,
      historicalLowest: 117900,
      historicalHighest: 134900,
      priceDropAmount: 15000,
      verdict: 'Great price drop ahead of annual retail discount cycles.',
      reason: 'Amazon and Flipkart competitive flash pricing.',
    },
  },
  {
    id: 'prod-7',
    title: 'Samsung Galaxy Tab S9 Ultra (14.6" Dynamic AMOLED 2X, 12GB, 256GB, S Pen)',
    brand: 'Samsung',
    model: 'Galaxy Tab S9 Ultra',
    category: 'Tablets',
    description: 'Massive 14.6-inch AMOLED 120Hz display with IP68 water and dust resistance. Includes S Pen with ultra-low latency.',
    imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80',
    bestPrice: 94999,
    originalPrice: 108999,
    currency: 'INR',
    rating: 4.7,
    reviewCount: 165,
    retailerCount: 3,
    inStock: true,
    dealScore: {
      score: 72,
      label: 'Good Deal',
      discountPercentage: 13,
      historicalAverage: 99999,
      historicalLowest: 89999,
      historicalHighest: 108999,
      priceDropAmount: 14000,
      verdict: 'Competitive pricing with bundled accessories available.',
      reason: 'Recent price cut by Samsung official storefront.',
    },
  },
  {
    id: 'prod-8',
    title: 'Logitech MX Master 3S Wireless Performance Mouse (Quiet Clicks, 8K DPI)',
    brand: 'Logitech',
    model: 'MX Master 3S',
    category: 'Accessories',
    description: 'Any-surface 8K DPI tracking, MagSpeed electromagnetic scrolling, and whisper-quiet click switches.',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    bestPrice: 8495,
    originalPrice: 10995,
    currency: 'INR',
    rating: 4.9,
    reviewCount: 3100,
    retailerCount: 4,
    inStock: true,
    dealScore: {
      score: 90,
      label: 'Hot Deal',
      discountPercentage: 23,
      historicalAverage: 9495,
      historicalLowest: 7995,
      historicalHighest: 10995,
      priceDropAmount: 2500,
      verdict: 'Rare steep discount on the premier productivity mouse.',
      reason: 'Flash deal on Amazon and Reliance Digital.',
    },
  },
]

export const MOCK_OFFERS: Record<string, Offer[]> = {
  'prod-1': [
    {
      id: 'off-1-1',
      productId: 'prod-1',
      retailerId: 'ret-amazon',
      retailerName: 'Amazon India',
      retailerLogo: 'https://logo.clearbit.com/amazon.in',
      title: 'Apple 2024 MacBook Air 15" M3 Laptop',
      url: 'https://www.amazon.in',
      price: 134900,
      originalPrice: 154900,
      shippingCost: 0,
      totalPrice: 134900,
      currency: 'INR',
      inStock: true,
      availabilityStatus: 'In Stock - Free One-Day Delivery',
      condition: 'NEW',
      lastCheckedAt: new Date().toISOString(),
    },
    {
      id: 'off-1-2',
      productId: 'prod-1',
      retailerId: 'ret-croma',
      retailerName: 'Croma',
      retailerLogo: 'https://logo.clearbit.com/croma.com',
      title: 'Apple MacBook Air M3 15.3 Inch 16GB 512GB',
      url: 'https://www.croma.com',
      price: 136990,
      originalPrice: 154900,
      shippingCost: 0,
      totalPrice: 136990,
      currency: 'INR',
      inStock: true,
      availabilityStatus: 'In Stock - Available for store pickup',
      condition: 'NEW',
      lastCheckedAt: new Date().toISOString(),
    },
    {
      id: 'off-1-3',
      productId: 'prod-1',
      retailerId: 'ret-reliance',
      retailerName: 'Reliance Digital',
      retailerLogo: 'https://logo.clearbit.com/reliancedigital.in',
      title: 'MacBook Air 15 M3 16GB RAM 512GB SSD',
      url: 'https://www.reliancedigital.in',
      price: 139900,
      originalPrice: 154900,
      shippingCost: 0,
      totalPrice: 139900,
      currency: 'INR',
      inStock: true,
      availabilityStatus: 'In Stock - Dispatches in 24 hours',
      condition: 'NEW',
      lastCheckedAt: new Date().toISOString(),
    },
    {
      id: 'off-1-4',
      productId: 'prod-1',
      retailerId: 'ret-flipkart',
      retailerName: 'Flipkart',
      retailerLogo: 'https://logo.clearbit.com/flipkart.com',
      title: 'Apple MacBook Air 15-inch M3 (16 GB / 512 GB)',
      url: 'https://www.flipkart.com',
      price: 142990,
      originalPrice: 154900,
      shippingCost: 100,
      totalPrice: 143090,
      currency: 'INR',
      inStock: false,
      availabilityStatus: 'Out of Stock',
      condition: 'NEW',
      lastCheckedAt: new Date().toISOString(),
    },
  ],
}

export const generateMockPriceHistory = (basePrice: number): PriceHistory[] => {
  const points: PriceHistory[] = []
  const now = new Date()
  const days = 30
  let currentPrice = basePrice * 1.15

  for (let i = days; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)

    // Random walk with trend towards basePrice
    const variance = (Math.random() - 0.48) * (basePrice * 0.03)
    currentPrice = Math.max(basePrice * 0.95, Math.min(basePrice * 1.25, currentPrice + variance))
    if (i === 0) currentPrice = basePrice

    const finalPrice = Math.round(currentPrice / 100) * 100
    points.push({
      id: `hist-${i}`,
      productId: 'mock',
      price: finalPrice,
      totalPrice: finalPrice,
      shippingCost: 0,
      currency: 'INR',
      recordedAt: d.toISOString(),
      observedAt: d.toISOString(),
      retailerName: 'Lowest Across Stores',
      retailerCode: 'ALL_STORES',
    })
  }
  return points
}

export const productsApi = {
  async getProducts(filters: ProductFilters = {}): Promise<PagedResponse<Product>> {
    try {
      const qVal = filters.query || (filters as any).q || ''
      const apiParams = {
        ...filters,
        q: qVal,
        query: qVal,
      }
      const response = await apiClient.get<PagedResponse<any>>('/products', { params: apiParams })
      const data = response.data
      const content = (data.content || []).map((p: any) => {
        const best = p.bestPrice ?? p.currentBestPrice ?? p.lowestPrice ?? 0
        return {
          ...p,
          id: String(p.id),
          bestPrice: best,
          originalPrice: p.originalPrice ?? Math.round(best * 1.15),
          model: p.model ?? p.modelNumber,
          currency: p.currency || 'INR',
          imageUrl: getProductImage(p.title, p.brand, p.category, p.imageUrl),
        }
      })
      return {
        ...data,
        content,
      }
    } catch {
      // Offline fallback: filter MOCK_PRODUCTS
      let filtered = [...MOCK_PRODUCTS].map((p) => ({
        ...p,
        imageUrl: getProductImage(p.title, p.brand, p.category, p.imageUrl),
      }))

      if (filters.query) {
        const q = filters.query.toLowerCase()
        filtered = filtered.filter(
          (p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
        )
      }
      if (filters.category) {
        filtered = filtered.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase())
      }
      if (filters.brand) {
        filtered = filtered.filter((p) => p.brand.toLowerCase() === filters.brand!.toLowerCase())
      }
      if (filters.minPrice !== undefined) {
        filtered = filtered.filter((p) => p.bestPrice >= filters.minPrice!)
      }
      if (filters.maxPrice !== undefined) {
        filtered = filtered.filter((p) => p.bestPrice <= filters.maxPrice!)
      }

      if (filters.sortBy === 'price_asc') {
        filtered.sort((a, b) => a.bestPrice - b.bestPrice)
      } else if (filters.sortBy === 'price_desc') {
        filtered.sort((a, b) => b.bestPrice - a.bestPrice)
      } else if (filters.sortBy === 'deal_score') {
        filtered.sort((a, b) => (b.dealScore?.score ?? 0) - (a.dealScore?.score ?? 0))
      }

      const page = filters.page || 1
      const size = filters.size || 8
      const startIndex = (page - 1) * size
      const pagedItems = filtered.slice(startIndex, startIndex + size)

      return {
        content: pagedItems,
        page,
        size,
        totalElements: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / size)),
        isFirst: page === 1,
        isLast: startIndex + size >= filtered.length,
      }
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<any[]>('/products/featured')
      return response.data.map((p: any) => {
        const best = p.bestPrice ?? p.currentBestPrice ?? p.lowestPrice ?? 0
        return {
          ...p,
          id: String(p.id),
          bestPrice: best,
          originalPrice: p.originalPrice ?? Math.round(best * 1.15),
          model: p.model ?? p.modelNumber,
          currency: p.currency || 'INR',
          imageUrl: getProductImage(p.title, p.brand, p.category, p.imageUrl),
        }
      })
    } catch {
      return MOCK_PRODUCTS.slice(0, 8).map((p) => ({
        ...p,
        imageUrl: getProductImage(p.title, p.brand, p.category, p.imageUrl),
      }))
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiClient.get<any>(`/products/${id}`)
      const p = response.data
      const best = p.bestPrice ?? p.currentBestPrice ?? p.lowestPrice ?? 0

      let desc = p.description
      if (!desc && p.attributes) {
        try {
          const parsed = typeof p.attributes === 'string' ? JSON.parse(p.attributes) : p.attributes
          if (parsed && typeof parsed === 'object') {
            desc = Object.entries(parsed)
              .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
              .join(' • ')
          } else {
            desc = String(p.attributes)
          }
        } catch {
          desc = p.attributes
        }
      }

      return {
        ...p,
        id: String(p.id),
        title: p.title,
        brand: p.brand,
        bestPrice: best,
        originalPrice: p.originalPrice ?? Math.round(best * 1.15),
        model: p.model ?? p.modelNumber,
        category: p.category || 'Electronics',
        description: desc,
        currency: p.currency || 'INR',
        imageUrl: getProductImage(p.title, p.brand, p.category, p.imageUrl),
        rating: p.rating || 4.7,
        reviewCount: p.reviewCount || 420,
      }
    } catch {
      const found = MOCK_PRODUCTS.find((p) => p.id === id)
      if (found) {
        return {
          ...found,
          imageUrl: getProductImage(found.title, found.brand, found.category, found.imageUrl),
        }
      }
      return {
        ...MOCK_PRODUCTS[0],
        id,
        title: `Product ${id}`,
        imageUrl: getProductImage(`Product ${id}`),
      }
    }
  },

  async getProductOffers(productId: string): Promise<Offer[]> {
    try {
      const response = await apiClient.get<any[]>(`/products/${productId}/offers`)
      return (response.data || []).map((o: any) => {
        const logo =
          o.retailerLogo ||
          (o.retailerCode === 'AMAZON_IN'
            ? 'https://logo.clearbit.com/amazon.in'
            : o.retailerCode === 'FLIPKART'
            ? 'https://logo.clearbit.com/flipkart.com'
            : o.retailerCode === 'CROMA'
            ? 'https://logo.clearbit.com/croma.com'
            : undefined)

        const isInStock =
          o.inStock !== undefined
            ? Boolean(o.inStock)
            : o.availability
            ? o.availability.toUpperCase() === 'IN_STOCK'
            : true

        const price = Number(o.price || 0)
        const shippingCost = Number(o.shippingCost || 0)
        const totalPrice = Number(o.totalPrice || price + shippingCost)

        return {
          ...o,
          id: String(o.id),
          productId: String(o.productId || productId),
          price,
          shippingCost,
          totalPrice,
          currency: o.currency || 'INR',
          inStock: isInStock,
          url: o.url || o.productUrl || '#',
          retailerLogo: logo,
          availabilityStatus: isInStock ? 'In Stock - Fast Delivery' : 'Out of Stock',
        }
      })
    } catch {
      const specific = MOCK_OFFERS[productId]
      if (specific) return specific
      const target = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0]
      return [
        {
          id: `off-${productId}-1`,
          productId,
          retailerId: 'ret-amazon',
          retailerName: 'Amazon India',
          retailerLogo: 'https://logo.clearbit.com/amazon.in',
          title: target.title,
          url: 'https://www.amazon.in',
          price: target.bestPrice,
          originalPrice: target.originalPrice,
          shippingCost: 0,
          totalPrice: target.bestPrice,
          currency: target.currency,
          inStock: true,
          availabilityStatus: 'In Stock - Free One-Day Delivery',
          condition: 'NEW',
          lastCheckedAt: new Date().toISOString(),
        },
        {
          id: `off-${productId}-2`,
          productId,
          retailerId: 'ret-croma',
          retailerName: 'Croma',
          retailerLogo: 'https://logo.clearbit.com/croma.com',
          title: target.title,
          url: 'https://www.croma.com',
          price: Math.round(target.bestPrice * 1.02),
          originalPrice: target.originalPrice,
          shippingCost: 0,
          totalPrice: Math.round(target.bestPrice * 1.02),
          currency: target.currency,
          inStock: true,
          availabilityStatus: 'In Stock',
          condition: 'NEW',
          lastCheckedAt: new Date().toISOString(),
        },
        {
          id: `off-${productId}-3`,
          productId,
          retailerId: 'ret-flipkart',
          retailerName: 'Flipkart',
          retailerLogo: 'https://logo.clearbit.com/flipkart.com',
          title: target.title,
          url: 'https://www.flipkart.com',
          price: Math.round(target.bestPrice * 1.04),
          originalPrice: target.originalPrice,
          shippingCost: 99,
          totalPrice: Math.round(target.bestPrice * 1.04) + 99,
          currency: target.currency,
          inStock: true,
          availabilityStatus: 'In Stock',
          condition: 'NEW',
          lastCheckedAt: new Date().toISOString(),
        },
      ]
    }
  },

  async getProductPriceHistory(productId: string, days: number = 30): Promise<PriceHistory[]> {
    try {
      const response = await apiClient.get<any>(`/products/${productId}/history`, {
        params: { days },
      })
      const data = response.data
      const rawPoints: any[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.history)
        ? data.history
        : []

      if (rawPoints.length > 0) {
        const points: PriceHistory[] = rawPoints.map((h: any, idx: number) => {
          const price = Number(h.totalPrice ?? h.price ?? 0)
          const dateStr = h.observedAt || h.recordedAt || new Date().toISOString()
          return {
            id: String(h.id || `hist-${productId}-${idx}`),
            productId: String(productId),
            price,
            shippingCost: Number(h.shippingCost || 0),
            totalPrice: price,
            currency: h.currency || 'INR',
            recordedAt: dateStr,
            observedAt: dateStr,
            retailerName: h.retailerName || 'Amazon India',
            retailerCode: h.retailerCode || 'AMAZON_IN',
            sourceReference: h.sourceReference,
          }
        })

        // Sort points strictly ascending by timestamp
        points.sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
        return points
      }

      // If backend history is empty, check product price and generate realistic baseline
      const prodRes = await apiClient.get<any>(`/products/${productId}`).catch(() => null)
      const basePrice = Number(prodRes?.data?.bestPrice || prodRes?.data?.currentBestPrice || 9999)
      return generateMockPriceHistory(basePrice)
    } catch {
      const target = MOCK_PRODUCTS.find(
        (p) => String(p.id) === String(productId) || p.id === `prod-${productId}`
      )
      const fallbackPrice = target?.bestPrice || 9999
      return generateMockPriceHistory(fallbackPrice)
    }
  },

  async getProductDealScore(productId: string): Promise<DealScore> {
    try {
      const response = await apiClient.get<any>(`/products/${productId}/deal-score`)
      const d = response.data
      return {
        ...d,
        score: Number(d.score || 0),
        historicalMin: d.historicalMin ? Number(d.historicalMin) : undefined,
        historicalMax: d.historicalMax ? Number(d.historicalMax) : undefined,
        historicalMedian: d.historicalMedian ? Number(d.historicalMedian) : undefined,
        currentBestPrice: d.currentBestPrice ? Number(d.currentBestPrice) : undefined,
        discountPercentage: d.historicalDiscountPercentage ? Number(d.historicalDiscountPercentage) : undefined,
      }
    } catch {
      const target = MOCK_PRODUCTS.find((p) => p.id === productId)
      return (
        target?.dealScore || {
          score: 75,
          label: 'Good Deal',
          discountPercentage: 10,
          historicalAverage: 100000,
          historicalLowest: 90000,
          historicalHighest: 110000,
          priceDropAmount: 10000,
          verdict: 'Favorable pricing compared to recent trends.',
          reason: 'Solid value across retailers.',
        }
      )
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>('/products/categories')
      return response.data
    } catch {
      return ['Laptops', 'Smartphones', 'Tablets', 'Accessories', 'Audio', 'Monitors']
    }
  },

  async getBrands(category?: string): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>('/products/brands', { params: { category } })
      return response.data
    } catch {
      return ['Apple', 'Samsung', 'Dell', 'Sony', 'Logitech', 'Lenovo', 'HP', 'Asus']
    }
  },

  async resolveProductByUrl(url: string): Promise<{ resolved: boolean; productId?: number | string; product?: any; message: string }> {
    try {
      const response = await apiClient.get<any>('/products/resolve', { params: { url } })
      return response.data
    } catch (err: any) {
      return {
        resolved: false,
        message: err?.response?.data?.message || 'Failed to resolve product from link',
      }
    }
  },
}

export const resolveProductByUrl = productsApi.resolveProductByUrl
