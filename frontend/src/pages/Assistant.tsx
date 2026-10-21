import React from 'react'
import { Sparkles, Zap } from 'lucide-react'
import ChatWindow from '../components/assistant/ChatWindow'

export const Assistant: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI Shopping Copilot
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            PriceWise Shopping Assistant
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time natural language comparisons, price trajectory forecasts, and deal recommendations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-medium">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live Data Connected</span>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <ChatWindow />
    </div>
  )
}

export default Assistant
