import React from 'react'
import { Clock, Database, RefreshCw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { ProviderHealth } from '../../types'
import { formatTimeAgo } from '../../utils/formatDate'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export interface ProviderHealthCardProps {
  provider: ProviderHealth
  onSync: (name: string) => void
  isSyncing?: boolean
}

export const ProviderHealthCard: React.FC<ProviderHealthCardProps> = ({
  provider,
  onSync,
  isSyncing = false,
}) => {
  const getStatusBadge = () => {
    switch (provider.status) {
      case 'HEALTHY':
        return (
          <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
            Operational
          </Badge>
        )
      case 'DEGRADED':
        return (
          <Badge variant="warning" size="sm" icon={<AlertTriangle className="w-3 h-3" />}>
            Degraded
          </Badge>
        )
      case 'DOWN':
        return (
          <Badge variant="danger" size="sm" icon={<XCircle className="w-3 h-3" />}>
            Offline
          </Badge>
        )
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:border-gray-300 transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h4 className="font-bold text-gray-900 text-sm truncate">{provider.name}</h4>
        {getStatusBadge()}
      </div>

      <div className="grid grid-cols-2 gap-3 my-4">
        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <span className="text-[10px] uppercase font-semibold text-gray-400 block">Success Rate</span>
          <span
            className={`text-base font-bold ${
              provider.successRate >= 98
                ? 'text-emerald-600'
                : provider.successRate >= 90
                ? 'text-amber-600'
                : 'text-red-600'
            }`}
          >
            {provider.successRate}%
          </span>
        </div>

        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <span className="text-[10px] uppercase font-semibold text-gray-400 block">Latency</span>
          <span className="text-base font-bold text-gray-800">{provider.latencyMs}ms</span>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-gray-500 mb-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-gray-400" /> Tracked Listings:
          </span>
          <span className="font-semibold text-gray-800">
            {provider.totalProducts.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" /> Last Sync:
          </span>
          <span className="font-medium text-gray-700">{formatTimeAgo(provider.lastSyncTime)}</span>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        fullWidth
        isLoading={isSyncing}
        onClick={() => onSync(provider.name)}
        leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
      >
        Trigger Provider Sync
      </Button>
    </div>
  )
}

export default ProviderHealthCard
