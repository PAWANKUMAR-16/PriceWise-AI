import React from 'react'
import { Filter, RotateCcw, Check } from 'lucide-react'
import Button from '../ui/Button'

export interface SearchFiltersProps {
  categories: string[]
  brands: string[]
  selectedCategory?: string
  selectedBrand?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  onCategoryChange: (category: string | undefined) => void
  onBrandChange: (brand: string | undefined) => void
  onPriceChange: (min?: number, max?: number) => void
  onSortChange: (sort: string) => void
  onReset: () => void
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  minPrice,
  maxPrice,
  sortBy = 'deal_score',
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onSortChange,
  onReset,
}) => {
  const sortOptions = [
    { value: 'deal_score', label: 'Highest Deal Score' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Recently Scraped' },
  ]

  const priceRanges = [
    { label: 'All Prices', min: undefined, max: undefined },
    { label: 'Under ₹10,000', min: 0, max: 10000 },
    { label: '₹10,000 - ₹30,000', min: 10000, max: 30000 },
    { label: '₹30,000 - ₹75,000', min: 30000, max: 75000 },
    { label: '₹75,000 - ₹1,50,000', min: 75000, max: 150000 },
    { label: 'Above ₹1,50,000', min: 150000, max: undefined },
  ]

  const hasActiveFilters = Boolean(selectedCategory || selectedBrand || minPrice !== undefined || maxPrice !== undefined)

  return (
    <aside className="w-full bg-white p-5 rounded-xl border border-gray-200 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-gray-900 text-sm">Filters & Sort</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full text-sm rounded-lg border border-gray-300 py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2.5">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange(undefined)}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
              !selectedCategory
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>All Categories</span>
            {!selectedCategory && <Check className="w-3.5 h-3.5" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                selectedCategory === cat
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{cat}</span>
              {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2.5">
          Price Range
        </h4>
        <div className="space-y-1">
          {priceRanges.map((range, idx) => {
            const isSelected = minPrice === range.min && maxPrice === range.max
            return (
              <button
                key={idx}
                onClick={() => onPriceChange(range.min, range.max)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{range.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2.5">
          Popular Brands
        </h4>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onBrandChange(undefined)}
            className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
              !selectedBrand
                ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            All
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => onBrandChange(brand)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                selectedBrand === brand
                  ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="pt-2">
          <Button variant="outline" size="sm" fullWidth onClick={onReset}>
            Clear All Filters
          </Button>
        </div>
      )}
    </aside>
  )
}

export default SearchFilters
