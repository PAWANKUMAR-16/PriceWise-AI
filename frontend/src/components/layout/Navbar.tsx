import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Search,
  Heart,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { resolveProductByUrl } from '../../api/products'

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Sync navbar search with current search query param if on /search
  useEffect(() => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search)
      const q = params.get('q') || params.get('query')
      if (q) setSearchQuery(q)
    }
  }, [location.pathname, location.search])

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
    const query = searchQuery.trim()
    if (!query) return

    if (isUrl(query)) {
      try {
        const fullUrl = query.startsWith('http') ? query : `https://${query}`
        const res = await resolveProductByUrl(fullUrl)
        const targetId = res?.productId || res?.product?.id
        if (res?.resolved && targetId) {
          navigate(`/products/${targetId}`)
          setMobileMenuOpen(false)
          return
        }
      } catch (err) {
        console.warn('Navbar URL resolve fallback to search', err)
      }
    }

    navigate(`/search?q=${encodeURIComponent(query)}`)
    setMobileMenuOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setUserDropdownOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs">
      {/* Top Announcement Ribbon */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-[11px] sm:text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-amber-300">💡</span>
            <span className="font-medium text-indigo-100 truncate">
              Find Best Price by adding <strong className="text-amber-300 font-bold">"pricewise.ai/"</strong> before any product link • Live tracking on Amazon, Flipkart, Croma
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-indigo-200 shrink-0">
            <div className="flex items-center gap-1 cursor-pointer hover:text-white">
              <span>🇮🇳 INR ₹</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-white">
              <span>🌐 English</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 lg:gap-6">
            {/* PriceWise AI Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <span className="font-black text-xl tracking-tighter">P</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 -ml-1 -mt-2" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black tracking-tight text-slate-900">
                    PriceWise
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-black uppercase rounded bg-indigo-100 text-indigo-700 tracking-wider">
                    AI
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-gray-400 tracking-wider -mt-1 hidden sm:block">
                  SMART PRICE TRACKER
                </span>
              </div>
            </Link>

            {/* Nav Menu Links */}
            <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold text-gray-700 shrink-0">
              <Link to="/search" className="hover:text-[#593cfb] transition-colors">
                All Products
              </Link>
              <Link to="/search?sortBy=deal_score" className="flex items-center gap-1 hover:text-[#593cfb] text-indigo-700 font-bold transition-colors">
                <span>Top Deals</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </Link>
              <Link to="/search?category=Laptops" className="hover:text-[#593cfb] transition-colors">
                Laptops
              </Link>
              <Link to="/search?category=Smartphones" className="hover:text-[#593cfb] transition-colors">
                Smartphones
              </Link>
              <Link to="/watchlist" className="hover:text-[#593cfb] transition-colors">
                Price Alerts
              </Link>
            </nav>

            {/* Center Search Input with Retailer Badges & Search Button */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 max-w-xl hidden md:flex items-center relative"
            >
              <div className="w-full relative flex items-center rounded-full border border-gray-200 bg-white shadow-2xs hover:border-[#593cfb] focus-within:border-[#593cfb] focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                <button
                  type="submit"
                  className="pl-3.5 pr-1 py-2 text-gray-400 hover:text-[#593cfb] transition-colors focus:outline-none"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 40+ gadgets or paste any Amazon / Flipkart / Croma link..."
                  className="w-full pl-2 pr-28 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent"
                />

                {/* Right side: supports badges & search button */}
                <div className="pr-1.5 flex items-center gap-1.5 shrink-0">
                  <div className="hidden xl:flex items-center gap-1 text-[10px] text-gray-400 font-medium mr-1">
                    <span>supports</span>
                    <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-[9px]" title="Amazon">a</span>
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-[9px]" title="Flipkart">f</span>
                    <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-600 font-bold flex items-center justify-center text-[9px]" title="Croma">c</span>
                  </div>

                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#593cfb] hover:bg-[#492de6] text-white rounded-full text-xs font-bold shadow-xs transition-all active:scale-95"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">

              {/* Login / User pill */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 font-bold text-xs text-gray-700"
                  >
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[11px] font-extrabold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="max-w-[70px] truncate">{user?.name || 'Account'}</span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                      <Link
                        to="/watchlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Watchlist & Alerts
                      </Link>
                      <Link
                        to="/notifications"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Notifications
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                        >
                          Admin Console
                        </Link>
                      )}
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-full border border-gray-300 hover:border-gray-400 text-xs font-bold text-gray-700 transition-colors"
                >
                  Login
                </Link>
              )}

              {/* Watchlist / Saved Button */}
              <Link
                to="/watchlist"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f0ecfc] hover:bg-[#e4ddfb] text-[#593cfb] font-extrabold text-xs transition-colors"
              >
                <Heart className="w-3.5 h-3.5 fill-[#593cfb]" />
                <span>Watchlist</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white px-4 py-3 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or paste product link..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs text-gray-800"
            />
          </form>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-gray-700">
            <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-center transition-colors">
              All Products
            </Link>
            <Link to="/search?sortBy=deal_score" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-center transition-colors">
              Top Deals 🔥
            </Link>
            <Link to="/search?category=Laptops" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-center transition-colors">
              Laptops
            </Link>
            <Link to="/watchlist" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-center transition-colors">
              Price Alerts
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
