import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingDown, Shield, Bell, Zap, Github, Twitter, Heart } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <TrendingDown className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                PriceWise<span className="text-emerald-400 font-bold ml-0.5">AI</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              PriceWise AI is an intelligent, automated shopping intelligence platform. We monitor real-time prices across major retailers, evaluate true deal scores with machine learning, and notify you when prices plunge.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/search?category=Laptops" className="hover:text-blue-400 transition-colors">
                  Laptops & MacBooks
                </Link>
              </li>
              <li>
                <Link to="/search?category=Smartphones" className="hover:text-blue-400 transition-colors">
                  Flagship Smartphones
                </Link>
              </li>
              <li>
                <Link to="/search?category=Tablets" className="hover:text-blue-400 transition-colors">
                  iPads & Android Tablets
                </Link>
              </li>
              <li>
                <Link to="/search?category=Accessories" className="hover:text-blue-400 transition-colors">
                  Audio & Accessories
                </Link>
              </li>
              <li>
                <Link to="/search?category=Monitors" className="hover:text-blue-400 transition-colors">
                  Monitors & Displays
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Intelligence
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <Link to="/search" className="hover:text-blue-400 transition-colors">
                  Price Comparison
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <Link to="/watchlist" className="hover:text-blue-400 transition-colors">
                  Instant Drop Alerts
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <Link to="/search?sortBy=deal_score" className="hover:text-blue-400 transition-colors">
                  Deal Score Algorithm
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Retailers */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Retailers Tracked
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>• Amazon India</li>
              <li>• Flipkart</li>
              <li>• Croma Retail</li>
              <li>• Reliance Digital</li>
              <li>• Tata CLiQ</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} PriceWise AI Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for savvy shoppers
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
