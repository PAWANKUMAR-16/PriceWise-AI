import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Store, ExternalLink } from 'lucide-react'
import { Product } from '../../types'
import { getProductImage } from '../../utils/productImages'
import PriceTag from '../ui/PriceTag'
import DealScoreBadge from '../ui/DealScoreBadge'
import Card from '../ui/Card'

export interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const displayImage = getProductImage(product.title, product.brand, product.category, product.imageUrl)

  return (
    <Card hover padding="none" className="flex flex-col h-full group bg-white">
      {/* Top Media & Badges */}
      <div className="relative aspect-4/3 bg-gray-100 overflow-hidden border-b border-gray-100">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={product.title}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Deal Score Badge top right */}
        {product.dealScore && (
          <div className="absolute top-2.5 right-2.5 z-10 shadow-sm">
            <DealScoreBadge score={product.dealScore.score} />
          </div>
        )}

        {/* Brand Tag top left */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-gray-700 px-2 py-0.5 rounded shadow-xs border border-gray-200">
            {product.brand}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
            <span>{product.category}</span>
            {product.retailerCount && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-gray-600 font-medium">
                  <Store className="w-3 h-3 text-blue-500" />
                  {product.retailerCount} stores
                </span>
              </>
            )}
          </div>

          <Link to={`/products/${product.id}`}>
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Rating & Pricing Bottom */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          {product.rating && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <span className="text-xs font-semibold text-gray-800">{product.rating}</span>
              {product.reviewCount && (
                <span className="text-xs text-gray-400">({product.reviewCount.toLocaleString()})</span>
              )}
            </div>
          )}

          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                Best Price
              </p>
              <PriceTag
                price={product.bestPrice}
                originalPrice={product.originalPrice}
                currency={product.currency}
                size="md"
              />
            </div>

            <Link
              to={`/products/${product.id}`}
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white transition-colors shrink-0"
              title="Compare all prices"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProductCard
