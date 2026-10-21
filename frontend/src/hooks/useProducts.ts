import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../api/products'
import { ProductFilters } from '../types'

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getProducts(filters),
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsApi.getFeaturedProducts(),
  })
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => (id ? productsApi.getProductById(id) : Promise.reject('No ID provided')),
    enabled: Boolean(id),
  })
}

export function useProductOffers(id: string | undefined) {
  return useQuery({
    queryKey: ['product-offers', id],
    queryFn: () => (id ? productsApi.getProductOffers(id) : Promise.reject('No ID provided')),
    enabled: Boolean(id),
  })
}

export function useProductPriceHistory(id: string | undefined, days: number = 30) {
  return useQuery({
    queryKey: ['product-history', id, days],
    queryFn: () => (id ? productsApi.getProductPriceHistory(id, days) : Promise.reject('No ID provided')),
    enabled: Boolean(id),
  })
}

export function useProductDealScore(id: string | undefined) {
  return useQuery({
    queryKey: ['product-deal-score', id],
    queryFn: () => (id ? productsApi.getProductDealScore(id) : Promise.reject('No ID provided')),
    enabled: Boolean(id),
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
  })
}

export function useBrands(category?: string) {
  return useQuery({
    queryKey: ['brands', category],
    queryFn: () => productsApi.getBrands(category),
  })
}
