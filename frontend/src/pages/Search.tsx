import React, { useMemo, useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Search as SearchIcon } from 'lucide-react'
import { useProducts, useCategories, useBrands } from '../hooks/useProducts'
import { resolveProductByUrl } from '../api/products'
import SearchFilters from '../components/products/SearchFilters'
import ProductGrid from '../components/products/ProductGrid'
import Button from '../components/ui/Button'

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const query = searchParams.get('q') || searchParams.get('query') || ''
  const [searchInput, setSearchInput] = useState(query)

  useEffect(() => {
    setSearchInput(query)
  }, [query])

  const category = searchParams.get('category') || undefined
  const brand = searchParams.get('brand') || undefined
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  const sortBy = (searchParams.get('sortBy') as any) || 'deal_score'
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1

  const isUrl = (text: string) => {
    const trimmed = text.trim()
    return (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.includes('amazon.in') ||
      trimmed.includes('flipkart.com') ||
      trimmed.includes('croma.com')
    )
  }

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = searchInput.trim()
    if (isUrl(text)) {
      try {
        const fullUrl = text.startsWith('http') ? text : `https://${text}`
        const res = await resolveProductByUrl(fullUrl)
        const targetId = res?.productId || res?.product?.id
        if (res?.resolved && targetId) {
          navigate(`/products/${targetId}`)
          return
        }
      } catch (err) {
        console.warn('URL resolve failed on search page', err)
      }
    }
    updateParam('q', text || undefined)
  }

  const filters = useMemo(
    () => ({
      query,
      category,
      brand,
      minPrice,
      maxPrice,
      sortBy,
      page,
      size: 8,
    }),
    [query, category, brand, minPrice, maxPrice, sortBy, page]
  )

  const { data: productsData, isLoading } = useProducts(filters)
  const { data: categories = [] } = useCategories()
  const { data: brands = [] } = useBrands(category)

  const updateParam = (key: string, value: string | undefined) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value !== undefined && value !== '') {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      // Reset page to 1 on filter changes unless changing page itself
      if (key !== 'page') {
        next.delete('page')
      }
      return next
    })
  }

  const handlePriceChange = (min?: number, max?: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (min !== undefined) next.set('minPrice', min.toString())
      else next.delete('minPrice')

      if (max !== undefined) next.set('maxPrice', max.toString())
      else next.delete('maxPrice')

      next.delete('page')
      return next
    })
  }

  const handleResetFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams()
      const currentQ = prev.get('q')
      if (currentQ) next.set('q', currentQ)
      return next
    })
  }

  const handlePageChange = (newPage: number) => {
    updateParam('page', newPage.toString())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalPages = productsData?.totalPages || 1
  const totalElements = productsData?.totalElements || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Title & Info Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <SearchIcon className="w-6 h-6 text-blue-600" />
            {query ? `Results for "${query}"` : category ? `${category}` : 'All Tracked Products'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing {productsData?.content.length || 0} of {totalElements} products across verified stores
          </p>
        </div>

        {/* On-page Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search by product name, model, brand..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-gray-50 hover:bg-white focus:bg-white text-sm text-gray-900 pl-10 pr-24 py-2 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
          />
          <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Grid & Filters Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filters */}
        <div className="lg:col-span-1">
          <SearchFilters
            categories={categories}
            brands={brands}
            selectedCategory={category}
            selectedBrand={brand}
            minPrice={minPrice}
            maxPrice={maxPrice}
            sortBy={sortBy}
            onCategoryChange={(cat) => updateParam('category', cat)}
            onBrandChange={(br) => updateParam('brand', br)}
            onPriceChange={handlePriceChange}
            onSortChange={(sort) => updateParam('sortBy', sort)}
            onReset={handleResetFilters}
          />
        </div>

        {/* Right Product Grid & Pagination */}
        <div className="lg:col-span-3 space-y-8">
          <ProductGrid
            products={productsData?.content || []}
            isLoading={isLoading}
            columns={3}
            emptyMessage={
              query
                ? `No products found matching "${query}". Try adjusting your filters or search keywords.`
                : 'No products found matching the selected filters.'
            }
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <div className="text-xs text-gray-500">
                Page <span className="font-semibold text-gray-900">{page}</span> of{' '}
                <span className="font-semibold text-gray-900">{totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>

                {/* Page number indicators */}
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                        p === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search
