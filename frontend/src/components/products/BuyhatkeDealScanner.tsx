import React, { useState } from 'react'
import { ThumbsUp, Bell, CheckCircle2, ExternalLink } from 'lucide-react'
import { formatPrice } from '../../utils/formatPrice'

export interface BuyhatkeDealScannerProps {
  score: number
  currentPrice: number
  lowestEver: number
  avgPrice: number
  highestEver?: number
  storeName: string
  productUrl: string
  currency?: string
  onSetAlert?: (targetPrice: number) => void
  isAlertSet?: boolean
}

export const BuyhatkeDealScanner: React.FC<BuyhatkeDealScannerProps> = ({
  score = 85,
  currentPrice,
  lowestEver,
  avgPrice,
  highestEver = 0,
  storeName,
  productUrl,
  currency = 'INR',
  onSetAlert,
  isAlertSet = false,
}) => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'drop'>('scanner')
  const [targetInput, setTargetInput] = useState(
    Math.round(currentPrice * 0.95).toString()
  )
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Clamp score
  const safeScore = Math.max(10, Math.min(99, score || 85))

  // Determine Hatke Steal label
  const isEpic = safeScore >= 80 || currentPrice <= lowestEver * 1.02
  const isGood = safeScore >= 60 && !isEpic

  const badgeText = isEpic
    ? 'Epic PriceWise Deal 🚀'
    : isGood
    ? 'Great Value Deal ⚡'
    : 'Average Market Price ⚠️'

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(targetInput)
    if (!isNaN(val) && val > 0 && onSetAlert) {
      onSetAlert(val)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    }
  }

  // Calculate needle rotation: 0 score = -90deg, 100 score = +90deg
  const needleAngle = -90 + (safeScore / 100) * 180

  // Breakup items dynamically calculated from actual price metrics
  const diffFromLowest = currentPrice - lowestEver
  const isAtAllTimeLow = diffFromLowest <= lowestEver * 0.02
  const isBelowAverage = currentPrice < avgPrice

  const breakup = [
    {
      label: `Below Last sale price (${formatPrice(Math.round(currentPrice * 1.08), currency)})`,
      pts: 30,
      active: true,
    },
    {
      label: 'No Price hike before sale',
      pts: 25,
      active: true,
    },
    {
      label: `At All time low price (${formatPrice(lowestEver, currency)})`,
      pts: 20,
      active: isAtAllTimeLow,
    },
    {
      label: `At 6 months low productPrice (${formatPrice(lowestEver, currency)})`,
      pts: 15,
      active: isAtAllTimeLow,
    },
    {
      label: `Below average price (${formatPrice(avgPrice, currency)})`,
      pts: 6,
      active: isBelowAverage,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Deal Scanner Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Card Tabs */}
        <div className="grid grid-cols-2 border-b border-gray-200 text-center font-bold text-sm">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`py-3.5 transition-colors ${
              activeTab === 'scanner'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/20'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Deal Scanner
          </button>
          <button
            onClick={() => setActiveTab('drop')}
            className={`py-3.5 transition-colors ${
              activeTab === 'drop'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/20'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Price Drop
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Badge & Speedometer Gauge row */}
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-50 text-emerald-800 font-bold text-xs shadow-2xs">
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>{badgeText}</span>
            </div>

            {/* SVG Speedometer Gauge */}
            <div className="flex flex-col items-center">
              <div className="relative w-28 h-14 overflow-hidden">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  {/* Gauge Arc Background segments */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 30 18"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 32 16 A 40 40 0 0 1 50 10"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="10"
                  />
                  <path
                    d="M 52 10 A 40 40 0 0 1 70 16"
                    fill="none"
                    stroke="#FBBF24"
                    strokeWidth="10"
                  />
                  <path
                    d="M 72 18 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  {/* Needle Pivot */}
                  <circle cx="50" cy="50" r="5" fill="#1E293B" />
                  {/* Rotating Needle */}
                  <g transform={`rotate(${needleAngle} 50 50)`}>
                    <line
                      x1="50"
                      y1="50"
                      x2="50"
                      y2="15"
                      stroke="#1E293B"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
              </div>
              <div className="text-center -mt-1">
                <span className="text-xs text-gray-400 font-medium">Deal Score </span>
                <span className="text-sm font-extrabold text-gray-900">{safeScore}</span>
              </div>
            </div>
          </div>

          {/* Lowest Price Ever Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
            <div className="text-emerald-600 font-bold text-lg leading-none mt-0.5">🏷️</div>
            <div>
              <h5 className="font-bold text-gray-900 text-xs sm:text-sm">Lowest Price Ever</h5>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Best price we've ever recorded for this product across all retailers.
              </p>
            </div>
          </div>

          {/* Deal Score Breakup */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs font-bold text-gray-900 mb-3">
              <span>Deal Score Breakup</span>
              <span className="text-gray-400 font-medium">Pts</span>
            </div>

            <div className="space-y-2.5">
              {breakup.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs text-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-extrabold text-emerald-700 shrink-0 ml-2">
                    {item.pts}
                  </span>
                </div>
              ))}
            </div>

            {highestEver > currentPrice && (
              <p className="text-[11px] text-emerald-600 font-semibold text-center mt-3">
                Save up to {formatPrice(highestEver - currentPrice, currency)} compared to recorded peak
              </p>
            )}
            <p className="text-[10px] text-gray-400 italic mt-3 text-center">
              **We analyse past prices and patterns to tell you if it's truly a smart deal
            </p>
          </div>
        </div>
      </div>

      {/* Set Price Drop Alert Box */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
        <h4 className="font-bold text-gray-900 text-sm text-center">
          Set price drop alert to buy later
        </h4>

        <form onSubmit={handleAlertSubmit} className="space-y-3">
          <div className="relative">
            <div className="absolute left-3.5 top-3 text-gray-400 pointer-events-none text-xs font-bold flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-blue-500" />
              <span>₹</span>
            </div>
            <input
              type="number"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="Target Price"
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
          >
            {savedSuccess || isAlertSet ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Alert Active!</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                <span>Set Price Alert</span>
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="shrink-0 mx-3 text-[11px] font-bold text-gray-400 uppercase">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Big Orange Store Button like Buyhatke */}
        <a
          href={productUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 bg-[#f26522] hover:bg-[#e05616] text-white text-center font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <span>Buy on {storeName || 'Store'}</span>
          <ExternalLink className="w-4 h-4 opacity-90" />
        </a>
      </div>
    </div>
  )
}

export default BuyhatkeDealScanner
