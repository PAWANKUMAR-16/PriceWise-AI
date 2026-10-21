import React, { useState, useEffect } from 'react'
import {
  Shield,
  Database,
  Users,
  Activity,
  Bell,
  RefreshCw,
  CheckCircle,
} from 'lucide-react'
import { adminApi } from '../api/admin'
import { IngestionRun, ProviderHealth } from '../types'
import IngestionRunsTable from '../components/admin/IngestionRunsTable'
import ProviderHealthCard from '../components/admin/ProviderHealthCard'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'

export const Admin: React.FC = () => {
  const [runs, setRuns] = useState<IngestionRun[]>([])
  const [providers, setProviders] = useState<ProviderHealth[]>([])
  const [stats, setStats] = useState<{
    totalUsers: number
    totalProducts: number
    totalScrapesToday: number
    activeAlerts: number
  }>({
    totalUsers: 0,
    totalProducts: 0,
    totalScrapesToday: 0,
    activeAlerts: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isTriggering, setIsTriggering] = useState(false)
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null)
  const [bannerMessage, setBannerMessage] = useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [runsData, providersData, statsData] = await Promise.all([
        adminApi.getIngestionRuns(),
        adminApi.getProvidersHealth(),
        adminApi.getAdminStats(),
      ])
      setRuns(runsData)
      setProviders(providersData)
      setStats(statsData)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleTriggerAll = async () => {
    setIsTriggering(true)
    try {
      const res = await adminApi.triggerIngestion()
      setBannerMessage(res.message)
      setTimeout(() => setBannerMessage(null), 5000)

      // Add mock running entry to table
      const newRun: IngestionRun = {
        id: 'run-' + Date.now().toString().slice(-3),
        providerName: 'Global Retailer Sync',
        status: 'RUNNING',
        itemsScanned: 0,
        itemsUpdated: 0,
        itemsCreated: 0,
        errorsCount: 0,
        durationSeconds: 0,
        startedAt: new Date().toISOString(),
      }
      setRuns((prev) => [newRun, ...prev])
    } finally {
      setIsTriggering(false)
    }
  }

  const handleSyncProvider = async (name: string) => {
    setSyncingProvider(name)
    try {
      const res = await adminApi.triggerIngestion(name)
      setBannerMessage(res.message)
      setTimeout(() => setBannerMessage(null), 5000)
    } finally {
      setSyncingProvider(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" message="Loading Admin Dashboard..." />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Top Banner Message */}
      {bannerMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-sm font-medium animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{bannerMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md mb-2">
            <Shield className="w-3.5 h-3.5" /> Administrator Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            System Ingestion & Health Operations
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Monitor background scrapers, provider latencies, and scheduled product catalog runs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold block">Total Users</span>
            <span className="text-2xl font-extrabold text-gray-900">
              {stats.totalUsers.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold block">
              Tracked Listings
            </span>
            <span className="text-2xl font-extrabold text-gray-900">
              {stats.totalProducts.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold block">
              Scrapes Today
            </span>
            <span className="text-2xl font-extrabold text-emerald-600">
              {stats.totalScrapesToday.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold block">
              Active Alerts
            </span>
            <span className="text-2xl font-extrabold text-amber-600">
              {stats.activeAlerts.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Provider Health Cards */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Retailer Connectors & Feed Health</h3>
          <p className="text-xs text-gray-500">
            Real-time latency, error rates, and sync health of retailer ingestion spiders
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {providers.map((p) => (
            <ProviderHealthCard
              key={p.id}
              provider={p}
              onSync={handleSyncProvider}
              isSyncing={syncingProvider === p.name}
            />
          ))}
        </div>
      </div>

      {/* Ingestion Runs Table */}
      <IngestionRunsTable
        runs={runs}
        onTriggerIngestion={handleTriggerAll}
        isTriggering={isTriggering}
      />
    </div>
  )
}

export default Admin
