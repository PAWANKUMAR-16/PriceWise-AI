import React from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Bell, TrendingDown, ArrowRight, PackageOpen } from 'lucide-react'
import { useWatchlist, useRemoveFromWatchlist, useUpdateWatchlist } from '../hooks/useWatchlist'
import WatchlistItem from '../components/watchlist/WatchlistItem'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { formatPrice } from '../utils/formatPrice'

export const Watchlist: React.FC = () => {
  const { data: watchlist = [], isLoading } = useWatchlist()
  const removeMutation = useRemoveFromWatchlist()
  const updateMutation = useUpdateWatchlist()

  const handleRemove = (id: string) => {
    removeMutation.mutate(id)
  }

  const handleUpdate = (id: string, targetPrice?: number, alertEnabled?: boolean) => {
    updateMutation.mutate({ watchlistId: id, targetPrice, alertEnabled })
  }

  const totalTracked = watchlist.length
  const activeAlerts = watchlist.filter((w) => w.alertEnabled).length
  const totalSavings = watchlist.reduce((sum, item) => {
    const diff = item.initialPrice - item.currentPrice
    return sum + (diff > 0 ? diff : 0)
  }, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2.5">
            <Bookmark className="w-7 h-7 text-blue-600 fill-blue-600/10" />
            My Price Watchlist
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Tracking price updates across multiple sellers with automatic drop alerts
          </p>
        </div>

        <Link to="/search">
          <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Add More Products
          </Button>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold block">Tracked Items</span>
            <span className="text-2xl font-extrabold text-gray-900">{totalTracked} Products</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold block">Total Savings</span>
            <span className="text-2xl font-extrabold text-emerald-600">
              {formatPrice(totalSavings)}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold block">Active Alerts</span>
            <span className="text-2xl font-extrabold text-purple-700">{activeAlerts} Live</span>
          </div>
        </div>
      </div>

      {/* Watchlist Items */}
      {isLoading ? (
        <div className="py-16 flex items-center justify-center">
          <Spinner size="lg" message="Loading your tracked items..." />
        </div>
      ) : watchlist.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center max-w-lg mx-auto">
          <PackageOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">Your Watchlist is Empty</h3>
          <p className="text-sm text-gray-500 mb-6">
            Find products you love, add them to your watchlist, and set price alerts to receive instant notifications when prices plunge.
          </p>
          <Link to="/search">
            <Button variant="primary">Explore Deals & Products</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {watchlist.map((item) => (
            <WatchlistItem
              key={item.id}
              item={item}
              onRemove={handleRemove}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Watchlist
