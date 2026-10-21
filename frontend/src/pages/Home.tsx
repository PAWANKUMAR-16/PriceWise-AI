import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Search,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Bell,
  Layers,
  Tag,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react'
import { useFeaturedProducts } from '../hooks/useProducts'
import { resolveProductByUrl } from '../api/products'
import ProductGrid from '../components/products/ProductGrid'
import Button from '../components/ui/Button'

export const Home: React.FC = () => {
  const [searchInput, setSearchInput] = useState('')
  const [isResolving, setIsResolving] = useState(false)
  const [resolveError, setResolveError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { data: featuredProducts, isLoading } = useFeaturedProducts()

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

  const handleProcessQuery = async (queryToProcess: string) => {
    const query = queryToProcess.trim()
    if (!query) return

    setResolveError(null)

    if (isUrl(query)) {
      setIsResolving(true)
      try {
        const fullUrl = query.startsWith('http') ? query : `https://${query}`
        const resolved = await resolveProductByUrl(fullUrl)
        const targetId = resolved?.productId || resolved?.product?.id
        if (resolved && resolved.resolved && targetId) {
          navigate(`/products/${targetId}`)
        } else {
          setResolveError(resolved?.message || 'Could not track this URL. Try searching by product name.')
        }
      } catch (err: any) {
        setResolveError('Could not extract product details from this link. Redirecting to search...')
        setTimeout(() => {
          navigate(`/search?q=${encodeURIComponent(query)}`)
        }, 1500)
      } finally {
        setIsResolving(false)
      }
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleProcessQuery(searchInput)
  }

  // Exact 4 Feature Cards from Buyhatke photos 3 & 4
  const buyhatkeFeatures = [
    {
      title: 'Price Alerts',
      desc: "Set a target price and we'll notify you the moment it drops.",
      tag: 'Current: ₹12,799 → Target: ₹10,999',
      icon: <Bell className="w-5 h-5 text-[#593cfb]" />,
      bgGradient: 'from-blue-50/60 to-purple-50/60',
      actionLink: '/watchlist',
      preview: (
        <div className="relative w-full h-36 flex items-center justify-center bg-radial from-blue-100/50 to-transparent">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-blue-300 flex items-center justify-center relative">
            <span className="text-3xl">👕</span>
            <div className="absolute -top-3 -right-2 bg-white shadow-xs border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold text-blue-700">
              ₹10,799
            </div>
            <div className="absolute -bottom-2 -left-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-xs">
              Alert ₹10,999
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Price Compare',
      desc: 'Compare the same product across stores in one view.',
      tag: 'Amazon vs Flipkart vs Croma',
      icon: <TrendingDown className="w-5 h-5 text-[#593cfb]" />,
      bgGradient: 'from-emerald-50/60 to-teal-50/60',
      actionLink: '/search',
      preview: (
        <div className="w-full h-36 flex flex-col justify-center px-4 space-y-1.5 bg-gray-50/80 rounded-xl">
          <div className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded-lg border border-gray-100 shadow-2xs">
            <span className="font-bold text-gray-700">Amazon</span>
            <span className="font-extrabold text-emerald-600">₹12,499</span>
          </div>
          <div className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded-lg border border-gray-100 shadow-2xs">
            <span className="font-bold text-gray-700">Flipkart</span>
            <span className="font-bold text-gray-600">₹13,499</span>
          </div>
          <div className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded-lg border border-gray-100 shadow-2xs">
            <span className="font-bold text-gray-700">Croma</span>
            <span className="font-bold text-gray-600">₹14,999</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Look-A-Like',
      desc: 'Find similar looking items at lower prices and save more.',
      tag: 'Visual Specs Matcher',
      icon: <Layers className="w-5 h-5 text-[#593cfb]" />,
      bgGradient: 'from-amber-50/60 to-orange-50/60',
      actionLink: '/search',
      preview: (
        <div className="w-full h-36 flex items-center justify-center gap-3 bg-gray-50/60 rounded-xl">
          <div className="w-16 h-20 bg-white rounded-lg border border-gray-200 p-1 flex flex-col items-center justify-center shadow-2xs">
            <span className="text-2xl">👟</span>
            <span className="text-[10px] font-bold text-gray-400 mt-1 line-through">₹4,999</span>
          </div>
          <span className="text-sm font-bold text-purple-600">→</span>
          <div className="w-16 h-20 bg-emerald-50 rounded-lg border border-emerald-300 p-1 flex flex-col items-center justify-center shadow-xs">
            <span className="text-2xl">👟</span>
            <span className="text-[10px] font-extrabold text-emerald-700 mt-1">₹2,199</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Auto Coupons',
      desc: 'PriceWise finds the best coupon and applies it automatically for you.',
      tag: 'Instant Savings',
      icon: <Tag className="w-5 h-5 text-[#593cfb]" />,
      bgGradient: 'from-purple-50/60 to-pink-50/60',
      actionLink: '/search',
      preview: (
        <div className="w-full h-36 flex flex-col items-center justify-center gap-2 bg-purple-50/40 rounded-xl px-4">
          <div className="w-full bg-white border border-purple-200 rounded-lg p-2 text-center shadow-2xs">
            <span className="text-[11px] font-black text-purple-700 uppercase tracking-wide">
              🎉 GET 20% OFF
            </span>
            <p className="text-[9px] text-gray-400">Verified & Auto-applied</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            Saved ₹1,200 instantly
          </span>
        </div>
      ),
    },
  ]

  const quickSamples = [
    { title: 'iPhone 15 Pro', url: 'https://www.amazon.in/dp/B0CHX1W1XY' },
    { title: 'OnePlus 12 5G', url: 'https://www.amazon.in/dp/B0CQPPV9K8' },
    { title: 'MacBook Air M2', url: 'https://www.amazon.in/dp/B0B3C57X2W' },
    { title: 'Sony WH-1000XM5', url: 'https://www.amazon.in/dp/B09XS7JWHH' },
    { title: 'Nothing Phone 3a', url: 'https://www.croma.com/p/275141' },
  ]

  return (
    <div className="bg-[#fbfbfd] min-h-screen flex flex-col">
      {/* ─── Exact Buyhatke Hero Section (from photos 3 & 4) ──────────────── */}
      <section className="pt-10 sm:pt-14 pb-12 px-4 max-w-7xl mx-auto w-full text-center space-y-4">
        {/* Subtle Category Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>SMART SHOPPING INTELLIGENCE</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">PriceWise AI</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Explore smart tools to check how PriceWise AI helps you track 30-day price drops, compare multi-store offers, and save money every time you shop.
        </p>

        {/* 4 Feature Demo Cards Row (from photos 3 & 4) */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
          {buyhatkeFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-purple-200 transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Visual Graphic Preview */}
                <div className="mb-4 overflow-hidden rounded-xl">
                  {feat.preview}
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1 rounded-md bg-purple-50">
                    {feat.icon}
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base">
                    {feat.title}
                  </h3>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {feat.desc}
                </p>
              </div>

              {/* Action Button: Direct navigation to the feature */}
              <div className="pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate(feat.actionLink)}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-[#593cfb] hover:from-blue-700 hover:to-[#492de6] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Buyhatke Paste URL or Search Center Box ──────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 w-full pb-8">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Track Historical Prices of Any Product
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Paste product link from Amazon, Flipkart, or Croma to see 30-day price charts & compare
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center rounded-2xl border-2 border-gray-200 focus-within:border-[#593cfb] overflow-hidden bg-white shadow-xs transition-all">
              <div className="pl-4 text-gray-400">
                {isUrl(searchInput) ? (
                  <LinkIcon className="w-5 h-5 text-[#593cfb] animate-pulse" />
                ) : (
                  <Search className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                disabled={isResolving}
                placeholder="Paste Amazon, Flipkart, or Croma link or type product name..."
                className="w-full py-4 pl-3 pr-32 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />

              <button
                type="submit"
                disabled={isResolving || !searchInput.trim()}
                className="absolute right-2 top-2 bottom-2 px-5 bg-[#593cfb] hover:bg-[#492de6] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {isResolving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : isUrl(searchInput) ? (
                  <>
                    <TrendingDown className="w-4 h-4" />
                    <span>Track Price</span>
                  </>
                ) : (
                  <>
                    <span>Compare</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {resolveError && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl">
              {resolveError}
            </div>
          )}

          {/* Quick Paste Sample Chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs pt-1">
            <span className="text-gray-400 font-medium">Quick samples:</span>
            {quickSamples.map((sample) => (
              <button
                key={sample.title}
                type="button"
                onClick={() => {
                  setSearchInput(sample.url)
                  handleProcessQuery(sample.url)
                }}
                className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-purple-50 hover:text-[#593cfb] border border-gray-200 text-gray-700 font-medium transition-colors"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products / Trending Deals Section ───────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#593cfb] bg-purple-50 px-2.5 py-1 rounded-md mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Live Price Drops
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Featured Price Drops & Hot Deals
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Real-time lowest prices detected across Amazon India, Flipkart, and Croma
            </p>
          </div>

          <Link to="/search">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All 40+ Products
            </Button>
          </Link>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={featuredProducts || []}
          isLoading={isLoading}
          columns={4}
        />
      </section>
    </div>
  )
}

export default Home
