import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { watchlistApi } from '../api/watchlist'

export function useWatchlist() {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: () => watchlistApi.getWatchlist(),
  })
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, targetPrice }: { productId: string; targetPrice?: number }) =>
      watchlistApi.addToWatchlist(productId, targetPrice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
    },
  })
}

export function useUpdateWatchlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      watchlistId,
      targetPrice,
      alertEnabled,
    }: {
      watchlistId: string
      targetPrice?: number
      alertEnabled?: boolean
    }) => watchlistApi.updateWatchlist(watchlistId, targetPrice, alertEnabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
    },
  })
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (watchlistId: string) => watchlistApi.removeFromWatchlist(watchlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
    },
  })
}
