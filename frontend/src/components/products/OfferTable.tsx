import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Offer } from '../../types'
import { formatPrice } from '../../utils/formatPrice'

export interface OfferTableProps {
  offers: Offer[]
}

export const OfferTable: React.FC<OfferTableProps> = ({ offers }) => {
  // Sort offers by total price ascending
  const sortedOffers = [...offers].sort((a, b) => a.totalPrice - b.totalPrice)
  const lowestPrice = sortedOffers[0]?.totalPrice || 0

  if (!offers || offers.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-2xl text-gray-500 border border-gray-200">
        No retailer offers currently listed for this product.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
      <div className="divide-y divide-gray-100">
        {sortedOffers.map((offer) => {
          const diffPct =
            lowestPrice > 0
              ? Math.round(((offer.totalPrice - lowestPrice) / lowestPrice) * 100)
              : 0
          const isLowest = diffPct === 0

          return (
            <a
              key={offer.id}
              href={offer.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 sm:p-4.5 flex items-center justify-between hover:bg-slate-50 transition-colors group"
            >
              {/* Left: Retailer Logo & Info */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-full border border-gray-200 bg-white p-1.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                  {offer.retailerLogo ? (
                    <img
                      src={offer.retailerLogo}
                      alt={offer.retailerName}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <span className="font-extrabold text-xs text-blue-600">
                      {offer.retailerName.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-snug truncate group-hover:text-blue-600 transition-colors">
                    {offer.retailerName}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">Free delivery</span>
                    {!offer.inStock && (
                      <span className="text-xs font-semibold text-rose-600">
                        • Currently Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Price & % Higher tag & Arrow */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <div className="text-right">
                  <div className="font-extrabold text-gray-900 text-base sm:text-lg">
                    {formatPrice(offer.totalPrice, offer.currency)}
                  </div>
                  {isLowest ? (
                    <span className="text-xs font-bold text-emerald-600">
                      Lowest Price
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-500">
                      {diffPct}% Higher
                    </span>
                  )}
                </div>

                <div className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default OfferTable
