import React from 'react'
import { DealScore } from '../../types'
import { getDealScoreMeta } from '../../utils/dealScore'
import { formatPrice } from '../../utils/formatPrice'
import { Zap, Sparkles, TrendingDown, ArrowDown, HelpCircle, CheckCircle } from 'lucide-react'
import DealScoreBadge from '../ui/DealScoreBadge'

export interface DealScorePanelProps {
  dealScore?: DealScore
  currency?: string
}

export const DealScorePanel: React.FC<DealScorePanelProps> = ({
  dealScore,
  currency = 'INR',
}) => {
  if (!dealScore) return null

  const meta = getDealScoreMeta(dealScore.score)
  const isGoodBuy = dealScore.score >= 70

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">PriceWise AI Deal Score</h3>
            <p className="text-[11px] text-gray-400">Algorithmic value assessment</p>
          </div>
        </div>
        <DealScoreBadge score={dealScore.score} />
      </div>

      {/* Main Score Radial / Big Number */}
      <div className="my-5 flex items-center justify-between bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-xl">
        <div>
          <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
            Overall Deal Rating
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl font-extrabold tracking-tight">{dealScore.score}</span>
            <span className="text-gray-400 text-lg font-medium">/100</span>
          </div>
          <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
            <Zap className="w-3 h-3" />
            {meta.label}
          </p>
        </div>

        <div className="text-right">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
              isGoodBuy
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {isGoodBuy ? <CheckCircle className="w-3.5 h-3.5" /> : <HelpCircle className="w-3.5 h-3.5" />}
            {isGoodBuy ? 'Buy Now' : 'Consider Waiting'}
          </div>
          {dealScore.discountPercentage && (
            <p className="text-xs text-gray-300 mt-2 font-medium">
              Save ~{dealScore.discountPercentage}% vs avg
            </p>
          )}
        </div>
      </div>

      {/* AI Verdict */}
      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg mb-4">
        <p className="text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          AI Analysis:
        </p>
        <p className="text-xs text-blue-800 leading-relaxed">{dealScore.verdict}</p>
        {dealScore.reason && (
          <p className="text-[11px] text-blue-600 mt-1.5 pt-1.5 border-t border-blue-200/60">
            • {dealScore.reason}
          </p>
        )}
      </div>

      {/* Breakdown Metrics */}
      <div className="space-y-2.5 text-xs">
        {dealScore.historicalAverage && (
          <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
            <span className="text-gray-500">Historical Average</span>
            <span className="font-semibold text-gray-800">
              {formatPrice(dealScore.historicalAverage, currency)}
            </span>
          </div>
        )}

        {dealScore.historicalLowest && (
          <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
            <span className="text-gray-500">Record Low</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              {formatPrice(dealScore.historicalLowest, currency)}
            </span>
          </div>
        )}

        {dealScore.historicalHighest && (
          <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
            <span className="text-gray-500">Record High</span>
            <span className="font-medium text-gray-600">
              {formatPrice(dealScore.historicalHighest, currency)}
            </span>
          </div>
        )}

        {dealScore.priceDropAmount && (
          <div className="flex justify-between items-center py-1.5">
            <span className="text-gray-500">Recent Price Drop</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <ArrowDown className="w-3 h-3" />
              {formatPrice(dealScore.priceDropAmount, currency)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default DealScorePanel
