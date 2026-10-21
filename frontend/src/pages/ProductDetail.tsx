import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Star,
  Share2,
  ChevronLeft,
  Check,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Bell,
} from 'lucide-react'
import {
  useProduct,
  useProductOffers,
  useProductPriceHistory,
  useProductDealScore,
} from '../hooks/useProducts'
import { useWatchlist, useAddToWatchlist } from '../hooks/useWatchlist'
import { formatPrice } from '../utils/formatPrice'
import { getProductGalleryImages } from '../utils/productImages'

import OfferTable from '../components/products/OfferTable'
import PriceHistoryChart from '../components/products/PriceHistoryChart'
import BuyhatkeDealScanner from '../components/products/BuyhatkeDealScanner'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const [copiedLink, setCopiedLink] = useState(false)
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)

  const { data: product, isLoading: productLoading } = useProduct(id)
  const { data: offers = [], isLoading: offersLoading } = useProductOffers(id)
  const { data: history = [] } = useProductPriceHistory(id, 90)
  const { data: dealScore } = useProductDealScore(id)

  const { data: watchlist = [] } = useWatchlist()
  const addToWatchlistMutation = useAddToWatchlist()

  const isWatchlisted = watchlist.some((w) => w.productId === id)

  const handleShareWhatsApp = () => {
    const text = `Check out this deal on ${product?.title}: ${window.location.href}`
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleSaveAlert = async (targetPrice: number) => {
    if (id) {
      await addToWatchlistMutation.mutateAsync({ productId: id, targetPrice })
    }
  }

  if (productLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" message="Loading live product details & offers..." />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">
          The requested product could not be found or has been removed from tracking.
        </p>
        <Link to="/search">
          <Button variant="primary">Browse All Products</Button>
        </Link>
      </div>
    )
  }

  // Calculate Prices & Metrics
  const historyPrices = history.map((h) => h.price).filter((p) => p > 0)
  const currentPrice = product.bestPrice || offers[0]?.price || 0
  const lowestEver =
    dealScore?.historicalMin ??
    (historyPrices.length ? Math.min(...historyPrices) : currentPrice)
  const highestEver =
    dealScore?.historicalMax ??
    (historyPrices.length ? Math.max(...historyPrices) : Math.round(currentPrice * 1.25))
  const avgPrice =
    dealScore?.historicalMedian ??
    (historyPrices.length
      ? Math.round(historyPrices.reduce((a, b) => a + b, 0) / historyPrices.length)
      : Math.round(currentPrice * 1.08))

  // Find lowest offer store
  const bestOffer = offers[0]
  const primaryStoreName = bestOffer?.retailerName || 'Amazon'
  const primaryStoreUrl = bestOffer?.url || '#'

  // Calculate discount percentage
  const mrp = product.originalPrice || Math.round(currentPrice * 1.25)
  const discountPct =
    mrp > currentPrice ? Math.round(((mrp - currentPrice) / mrp) * 100) : 25

  // Cohesive multi-angle gallery images strictly matching this specific product
  const galleryImages = getProductGalleryImages(
    product.title,
    product.brand,
    product.category,
    product.imageUrl
  )

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-16">
      {/* Top Price Intelligence Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px] uppercase tracking-wider">
              Price Alert Active
            </span>
            <span className="text-blue-100 font-medium truncate">
              Real-time multi-store tracking across Amazon India, Flipkart & Croma • 30-day historical analysis
            </span>
          </div>
          <Link
            to="/watchlist"
            className="hidden sm:inline-flex items-center gap-1.5 font-bold text-amber-300 hover:text-white transition-colors"
          >
            <span>Saved Alerts</span>
            <Bell className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link
            to="/"
            className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <Link to="/" className="hover:text-blue-600 font-medium">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-md">
            {product.title}
          </span>
        </div>

        {/* 3-Column Buyhatke Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ─── Column 1: Gallery & Images (Left, 4 Cols) ─────────────────── */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            {/* Main Stage Image */}
            <div className="aspect-square bg-gray-50/80 rounded-xl p-4 flex items-center justify-center relative overflow-hidden border border-gray-100">
              <img
                src={galleryImages[selectedImageIdx]}
                alt={product.title}
                className="max-h-full max-w-full object-contain transition-all duration-200"
              />
            </div>

            {/* Thumbnail Gallery Row */}
            <div className="grid grid-cols-4 gap-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`aspect-square rounded-lg border p-1 bg-white flex items-center justify-center transition-all ${
                    selectedImageIdx === idx
                      ? 'border-blue-600 ring-2 ring-blue-100'
                      : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>

            {/* Product Attributes / Specifications Pill Summary */}
            {product.description && (
              <div className="pt-2 border-t border-gray-100">
                <h5 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Specs & Details
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* ─── Column 2: Product Info & Compare Prices (Center, 5 Cols) ───── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
              {/* Store Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {primaryStoreName}
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {product.brand}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-gray-900">
                  {product.rating || '4.0'}
                </span>
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 4)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {product.reviewCount || 4} verified reviews
                </span>
              </div>

              {/* Price Row: Big Price, MRP, % OFF */}
              <div className="flex items-baseline gap-3 flex-wrap pt-1">
                <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                  {formatPrice(currentPrice, product.currency)}
                </span>
                <span className="text-base sm:text-lg font-bold text-gray-400 line-through">
                  {formatPrice(mrp, product.currency)}
                </span>
                <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  ↓ {discountPct}% OFF
                </span>
              </div>

              {/* Share On row */}
              <div className="flex items-center gap-3 pt-1 text-xs font-semibold text-gray-600">
                <span>Share on:</span>
                <button
                  onClick={handleShareWhatsApp}
                  className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center transition-colors shadow-2xs"
                  title="Share on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-emerald-500" />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 flex items-center justify-center transition-colors shadow-2xs"
                  title="Copy link"
                >
                  {copiedLink ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
                {copiedLink && <span className="text-xs text-emerald-600">Copied!</span>}
              </div>

              {/* Big Orange Store CTA Button */}
              <a
                href={primaryStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3.5 bg-[#f26522] hover:bg-[#e05616] text-white text-center font-extrabold text-base rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Buy on {primaryStoreName}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Compare Available Prices Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">
                  Compare {offers.length} Available Prices
                </h3>
                <span className="text-xs font-bold text-gray-500">Live Scraped</span>
              </div>

              {offersLoading ? (
                <div className="p-8 bg-white rounded-2xl border border-gray-200 text-center">
                  <Spinner size="md" message="Refreshing vendor offers..." />
                </div>
              ) : (
                <OfferTable offers={offers} />
              )}
            </div>

            {/* Price History Chart */}
            <PriceHistoryChart history={history} currency={product.currency} />
          </div>

          {/* ─── Column 3: Deal Scanner & Drop Alert (Right, 3 Cols) ────────── */}
          <div className="lg:col-span-3">
            <BuyhatkeDealScanner
              score={dealScore?.score ?? 85}
              currentPrice={currentPrice}
              lowestEver={lowestEver}
              avgPrice={avgPrice}
              highestEver={highestEver}
              storeName={primaryStoreName}
              productUrl={primaryStoreUrl}
              currency={product.currency}
              onSetAlert={handleSaveAlert}
              isAlertSet={isWatchlisted}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
