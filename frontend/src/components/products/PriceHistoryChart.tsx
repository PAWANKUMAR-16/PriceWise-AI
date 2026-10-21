import React, { useState, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from 'recharts'
import { PriceHistory } from '../../types'
import { formatDate } from '../../utils/formatDate'
import { formatPrice } from '../../utils/formatPrice'
import { TrendingDown, ArrowDownRight, ArrowUpRight, Minus, Store } from 'lucide-react'

export interface PriceHistoryChartProps {
  history: PriceHistory[]
  currency?: string
}

interface DailyAggregatedPoint {
  date: string
  price: number
  bestStore: string
  storePrices: Record<string, number>
  formattedDate: string
  fullDate: string
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  history = [],
  currency = 'INR',
}) => {
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [selectedStore, setSelectedStore] = useState<string>('ALL')

  // Extract unique stores present in the history
  const availableStores = useMemo(() => {
    const storeSet = new Set<string>()
    history.forEach((item) => {
      if (item.retailerName && item.retailerName !== 'Lowest Across Stores') {
        storeSet.add(item.retailerName)
      }
    })
    return Array.from(storeSet)
  }, [history])

  // Group and sort data chronologically
  const chartData = useMemo(() => {
    if (!history || history.length === 0) return []

    // 1. Sort raw items chronologically
    const sorted = [...history].sort(
      (a, b) =>
        new Date(a.recordedAt || a.observedAt || 0).getTime() -
        new Date(b.recordedAt || b.observedAt || 0).getTime()
    )

    // 2. Filter by store if not 'ALL'
    const storeFiltered =
      selectedStore === 'ALL'
        ? sorted
        : sorted.filter((item) => item.retailerName === selectedStore)

    if (storeFiltered.length === 0) return []

    // 3. Aggregate by calendar date (yyyy-MM-dd) to avoid multiple jagged vertical lines for the same date
    const dayMap = new Map<
      string,
      {
        timestamp: number
        dateIso: string
        minPrice: number
        bestStore: string
        storePrices: Record<string, number>
      }
    >()

    storeFiltered.forEach((item) => {
      const rawDateStr = item.recordedAt || item.observedAt || new Date().toISOString()
      const d = new Date(rawDateStr)
      if (isNaN(d.getTime())) return

      // Use yyyy-MM-dd as the aggregation key
      const dayKey = d.toISOString().split('T')[0]
      const price = Number(item.totalPrice ?? item.price ?? 0)
      if (price <= 0) return

      const storeName = item.retailerName || 'Retailer'

      if (!dayMap.has(dayKey)) {
        dayMap.set(dayKey, {
          timestamp: d.getTime(),
          dateIso: rawDateStr,
          minPrice: price,
          bestStore: storeName,
          storePrices: { [storeName]: price },
        })
      } else {
        const existing = dayMap.get(dayKey)!
        existing.storePrices[storeName] = price
        if (price < existing.minPrice) {
          existing.minPrice = price
          existing.bestStore = storeName
        }
      }
    })

    const aggregatedList: DailyAggregatedPoint[] = Array.from(dayMap.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .map(([, val]) => ({
        date: val.dateIso,
        price: val.minPrice,
        bestStore: val.bestStore,
        storePrices: val.storePrices,
        formattedDate: formatDate(val.dateIso, 'dd MMM'),
        fullDate: formatDate(val.dateIso, 'EEEE, dd MMMM yyyy'),
      }))

    if (aggregatedList.length === 0) return []

    // 4. Time range filtering relative to the latest recorded observation
    const latestTimestamp = aggregatedList[aggregatedList.length - 1]
      ? new Date(aggregatedList[aggregatedList.length - 1].date).getTime()
      : Date.now()

    const daysLimit = selectedRange === '7d' ? 7 : selectedRange === '30d' ? 30 : 90
    const cutoffTimestamp = latestTimestamp - daysLimit * 24 * 60 * 60 * 1000

    const rangeFiltered = aggregatedList.filter(
      (item) => new Date(item.date).getTime() >= cutoffTimestamp
    )

    // Ensure we have at least 2 points for a smooth line; if range cutoff resulted in fewer points, take the last few
    const finalPoints =
      rangeFiltered.length >= 2
        ? rangeFiltered
        : aggregatedList.slice(-Math.min(aggregatedList.length, 7))

    // Edge case: If only 1 observation exists in entire history, synthesize a clean horizontal 7-day timeline
    if (finalPoints.length === 1) {
      const single = finalPoints[0]
      const prevDate = new Date(single.date)
      prevDate.setDate(prevDate.getDate() - 7)
      return [
        {
          ...single,
          date: prevDate.toISOString(),
          formattedDate: formatDate(prevDate, 'dd MMM'),
          fullDate: formatDate(prevDate, 'EEEE, dd MMMM yyyy'),
        },
        single,
      ]
    }

    return finalPoints
  }, [history, selectedRange, selectedStore])

  const prices = chartData.map((d) => d.price)
  const minPrice = prices.length ? Math.min(...prices) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 0
  const currentPrice = prices.length ? prices[prices.length - 1] : 0
  const firstPrice = prices.length ? prices[0] : 0
  const priceDifference = currentPrice - firstPrice
  const diffPct =
    firstPrice > 0 ? Math.abs((priceDifference / firstPrice) * 100).toFixed(1) : '0'

  // Lowest record details
  const lowestRecord = chartData.find((d) => d.price === minPrice)

  // Calculate dynamic Y-axis bounds with gentle padding so curve doesn't clip
  const yDomainMin = minPrice > 0 ? Math.floor(minPrice * 0.985) : 0
  const yDomainMax = maxPrice > 0 ? Math.ceil(maxPrice * 1.015) : 10000

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-blue-600" />
            Price History & Fluctuations
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Chronological multi-retailer price tracking with verified daily lowest prices
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 bg-gray-100/90 p-1 rounded-xl self-start sm:self-auto border border-gray-200">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedRange === range
                  ? 'bg-white text-blue-600 shadow-xs border border-gray-100'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Store Filter Tabs (if multiple stores exist) */}
      {availableStores.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-gray-400 font-semibold flex items-center gap-1 shrink-0">
            <Store className="w-3.5 h-3.5" />
            Store:
          </span>
          <button
            onClick={() => setSelectedStore('ALL')}
            className={`px-3 py-1 rounded-lg font-bold transition-all shrink-0 ${
              selectedStore === 'ALL'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Stores (Lowest Price)
          </button>
          {availableStores.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStore(st)}
              className={`px-3 py-1 rounded-lg font-bold transition-all shrink-0 ${
                selectedStore === st
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      )}

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-gradient-to-br from-gray-50/80 to-blue-50/30 rounded-xl border border-gray-100">
        <div>
          <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wide">
            Lowest In Range
          </span>
          <span className="text-base font-extrabold text-emerald-600">
            {formatPrice(minPrice, currency)}
          </span>
          {lowestRecord && selectedStore === 'ALL' && (
            <span className="text-[10px] text-gray-500 block truncate">
              via {lowestRecord.bestStore}
            </span>
          )}
        </div>

        <div>
          <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wide">
            Highest In Range
          </span>
          <span className="text-base font-extrabold text-gray-700">
            {formatPrice(maxPrice, currency)}
          </span>
          <span className="text-[10px] text-gray-400 block">Peak observation</span>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wide">
            Latest Price
          </span>
          <span className="text-base font-extrabold text-blue-600">
            {formatPrice(currentPrice, currency)}
          </span>
          <span className="text-[10px] text-gray-500 block">
            {chartData[chartData.length - 1]?.formattedDate || 'Today'}
          </span>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wide">
            Range Shift
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            {priceDifference < 0 ? (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5 inline mr-0.5" />
                {formatPrice(Math.abs(priceDifference), currency)} ({diffPct}%)
              </span>
            ) : priceDifference > 0 ? (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5 inline mr-0.5" />
                +{formatPrice(priceDifference, currency)} (+{diffPct}%)
              </span>
            ) : (
              <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md flex items-center">
                <Minus className="w-3.5 h-3.5 inline mr-0.5" />
                Stable
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-72 w-full pt-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 15, right: 15, left: -5, bottom: 5 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />

              <XAxis
                dataKey="formattedDate"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
                dy={6}
              />

              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[yDomainMin, yDomainMax]}
                tickFormatter={(val) =>
                  `₹${val >= 1000 ? (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1) + 'k' : val}`
                }
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data: DailyAggregatedPoint = payload[0].payload
                    return (
                      <div className="bg-slate-900/95 backdrop-blur-sm text-white px-3.5 py-2.5 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700/60 max-w-xs">
                        <p className="font-semibold text-slate-400 text-[11px] border-b border-slate-700/60 pb-1">
                          {data.fullDate}
                        </p>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-slate-300">
                            {selectedStore === 'ALL' ? 'Lowest Price:' : `${selectedStore}:`}
                          </span>
                          <span className="text-sm font-extrabold text-emerald-400">
                            {formatPrice(data.price, currency)}
                          </span>
                        </div>
                        {selectedStore === 'ALL' && data.bestStore && (
                          <div className="text-[11px] text-slate-400">
                            Offered by:{' '}
                            <span className="font-bold text-amber-300">{data.bestStore}</span>
                          </div>
                        )}
                        {/* Breakdown of other stores on this date if available */}
                        {selectedStore === 'ALL' &&
                          Object.keys(data.storePrices || {}).length > 1 && (
                            <div className="pt-1 border-t border-slate-800 space-y-0.5 text-[10px] text-slate-400">
                              {Object.entries(data.storePrices).map(([st, p]) => (
                                <div key={st} className="flex justify-between gap-2">
                                  <span>{st}:</span>
                                  <span className={p === data.price ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                                    {formatPrice(p, currency)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    )
                  }
                  return null
                }}
              />

              {/* Reference Line for Lowest Price */}
              {minPrice > 0 && (
                <ReferenceLine
                  y={minPrice}
                  stroke="#10B981"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `Lowest ₹${minPrice.toLocaleString('en-IN')}`,
                    fill: '#059669',
                    fontSize: 10,
                    fontWeight: 700,
                    position: 'insideBottomRight',
                    offset: 10,
                  }}
                />
              )}

              <Area
                type="monotone"
                dataKey="price"
                stroke="#2563EB"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#priceGradient)"
                activeDot={{
                  r: 5,
                  stroke: '#1D4ED8',
                  strokeWidth: 2,
                  fill: '#FFFFFF',
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-gray-400">
            No price history observations found for this period.
          </div>
        )}
      </div>
    </div>
  )
}

export default PriceHistoryChart
