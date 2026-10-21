import React from 'react'
import { Product } from '../../types'
import ProductCard from './ProductCard'
import Spinner from '../ui/Spinner'
import { PackageOpen } from 'lucide-react'

export interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
  emptyMessage?: string
  columns?: 2 | 3 | 4
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  emptyMessage = 'No products found matching your criteria.',
  columns = 4,
}) => {
  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <Spinner size="lg" message="Loading live retailer prices..." />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white p-8">
        <PackageOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h4 className="text-base font-semibold text-gray-800 mb-1">No Products Found</h4>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">{emptyMessage}</p>
      </div>
    )
  }

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
