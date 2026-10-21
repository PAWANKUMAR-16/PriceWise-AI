import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Bell, BellOff, ArrowDownRight, ArrowUpRight, Edit2, Check } from 'lucide-react'
import { Watchlist } from '../../types'
import { formatPrice } from '../../utils/formatPrice'
import { formatDate } from '../../utils/formatDate'
import { getProductImage } from '../../utils/productImages'
import DealScoreBadge from '../ui/DealScoreBadge'


export interface WatchlistItemProps {
  item: Watchlist
  onRemove: (id: string) => void
  onUpdate: (id: string, targetPrice?: number, alertEnabled?: boolean) => void
}

export const WatchlistItem: React.FC<WatchlistItemProps> = ({ item, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [targetPriceInput, setTargetPriceInput] = useState(
    item.targetPrice ? item.targetPrice.toString() : ''
  )

  const priceDiff = item.currentPrice - item.initialPrice
  const isDrop = priceDiff < 0
  const isTargetReached = item.targetPrice && item.currentPrice <= item.targetPrice

  const handleSaveTarget = () => {
    const val = parseFloat(targetPriceInput)
    if (!isNaN(val) && val > 0) {
      onUpdate(item.id, val, item.alertEnabled)
    }
    setIsEditing(false)
  }

  const toggleAlert = () => {
    onUpdate(item.id, item.targetPrice, !item.alertEnabled)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-xs hover:border-blue-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Product Information */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 border border-gray-100 rounded-lg p-2 shrink-0 flex items-center justify-center">
          <img
            src={getProductImage(item.product.title, item.product.brand, item.product.category, item.product.imageUrl)}
            alt={item.product.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
              {item.product.brand}
            </span>
            {item.product.dealScore && (
              <DealScoreBadge score={item.product.dealScore.score} size="sm" />
            )}
            {isTargetReached && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded animate-pulse">
                Target Met!
              </span>
            )}
          </div>

          <Link to={`/products/${item.product.id}`}>
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base hover:text-blue-600 truncate transition-colors">
              {item.product.title}
            </h4>
          </Link>

          <p className="text-xs text-gray-400 mt-0.5">
            Added on {formatDate(item.createdAt, 'dd MMM yyyy')}
          </p>
        </div>
      </div>

      {/* Pricing & Target Price Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        {/* Current price and change */}
        <div className="text-left sm:text-right">
          <span className="text-[11px] text-gray-400 uppercase font-semibold block">
            Current Best
          </span>
          <span className="text-lg font-bold text-gray-900 block">
            {formatPrice(item.currentPrice)}
          </span>
          {priceDiff !== 0 ? (
            <span
              className={`text-xs font-semibold flex items-center gap-0.5 sm:justify-end ${
                isDrop ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {isDrop ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
              {formatPrice(Math.abs(priceDiff))} ({isDrop ? 'drop' : 'rise'})
            </span>
          ) : (
            <span className="text-xs text-gray-400">No change since added</span>
          )}
        </div>

        {/* Target Price */}
        <div className="text-left sm:text-right min-w-[120px]">
          <span className="text-[11px] text-gray-400 uppercase font-semibold block">
            Target Alert
          </span>

          {isEditing ? (
            <div className="flex items-center gap-1 mt-1">
              <input
                type="number"
                value={targetPriceInput}
                onChange={(e) => setTargetPriceInput(e.target.value)}
                className="w-20 text-xs px-2 py-1 border border-blue-400 rounded focus:outline-none"
                placeholder="₹ Target"
                autoFocus
              />
              <button
                onClick={handleSaveTarget}
                className="p-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center sm:justify-end gap-1.5 mt-0.5">
              <span className="text-sm font-semibold text-gray-800">
                {item.targetPrice ? formatPrice(item.targetPrice) : 'None set'}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-blue-600 p-1"
                title="Edit Target Price"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAlert}
            className={`p-2 rounded-lg border transition-colors ${
              item.alertEnabled
                ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-600'
            }`}
            title={item.alertEnabled ? 'Alerts Active' : 'Alerts Muted'}
          >
            {item.alertEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onRemove(item.id)}
            className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
            title="Remove from Watchlist"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default WatchlistItem
