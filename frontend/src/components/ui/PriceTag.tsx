import React from 'react'
import clsx from 'clsx'
import { formatPrice } from '../../utils/formatPrice'

export interface PriceTagProps {
  price: number
  originalPrice?: number
  currency?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showSavings?: boolean
  className?: string
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  originalPrice,
  currency = 'INR',
  size = 'md',
  showSavings = false,
  className,
}) => {
  const hasDiscount = originalPrice && originalPrice > price
  const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
  const savingsAmount = hasDiscount ? originalPrice - price : 0

  const priceSizes = {
    sm: 'text-sm font-semibold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-extrabold',
    xl: 'text-3xl font-extrabold tracking-tight',
  }

  const originalPriceSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }

  return (
    <div className={clsx('flex flex-wrap items-baseline gap-2', className)}>
      <span className={clsx('text-gray-900', priceSizes[size])}>
        {formatPrice(price, currency)}
      </span>

      {hasDiscount && (
        <>
          <span className={clsx('text-gray-400 line-through font-normal', originalPriceSizes[size])}>
            {formatPrice(originalPrice, currency)}
          </span>
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            {discountPercent}% OFF
          </span>
        </>
      )}

      {showSavings && hasDiscount && (
        <span className="w-full text-xs text-emerald-600 font-medium">
          Save {formatPrice(savingsAmount, currency)}
        </span>
      )}
    </div>
  )
}

export default PriceTag
