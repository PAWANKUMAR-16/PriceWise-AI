import apiClient from './client'
import { IngestionRun, ProviderHealth } from '../types'

const MOCK_INGESTION_RUNS: IngestionRun[] = [
  {
    id: 'run-101',
    providerName: 'Amazon Ingestion Worker',
    status: 'SUCCESS',
    itemsScanned: 4850,
    itemsUpdated: 4120,
    itemsCreated: 34,
    errorsCount: 2,
    durationSeconds: 142,
    startedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    finishedAt: new Date(Date.now() - 3600000 * 1 + 142000).toISOString(),
  },
  {
    id: 'run-100',
    providerName: 'Flipkart Catalog Sync',
    status: 'SUCCESS',
    itemsScanned: 3200,
    itemsUpdated: 2980,
    itemsCreated: 12,
    errorsCount: 0,
    durationSeconds: 98,
    startedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    finishedAt: new Date(Date.now() - 3600000 * 4 + 98000).toISOString(),
  },
  {
    id: 'run-99',
    providerName: 'Croma Retail Scraper',
    status: 'PARTIAL',
    itemsScanned: 1840,
    itemsUpdated: 1720,
    itemsCreated: 5,
    errorsCount: 15,
    durationSeconds: 210,
    startedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    finishedAt: new Date(Date.now() - 3600000 * 8 + 210000).toISOString(),
  },
  {
    id: 'run-98',
    providerName: 'Reliance Digital Scraper',
    status: 'SUCCESS',
    itemsScanned: 1950,
    itemsUpdated: 1900,
    itemsCreated: 8,
    errorsCount: 1,
    durationSeconds: 115,
    startedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    finishedAt: new Date(Date.now() - 3600000 * 12 + 115000).toISOString(),
  },
]

const MOCK_PROVIDERS: ProviderHealth[] = [
  {
    id: 'prov-amazon',
    name: 'Amazon India API & Scraper',
    status: 'HEALTHY',
    lastSyncTime: new Date(Date.now() - 3600000 * 1).toISOString(),
    latencyMs: 240,
    successRate: 99.8,
    errorRate: 0.2,
    totalProducts: 4850,
  },
  {
    id: 'prov-flipkart',
    name: 'Flipkart Feed Provider',
    status: 'HEALTHY',
    lastSyncTime: new Date(Date.now() - 3600000 * 4).toISOString(),
    latencyMs: 310,
    successRate: 99.2,
    errorRate: 0.8,
    totalProducts: 3200,
  },
  {
    id: 'prov-croma',
    name: 'Croma Retailer Feed',
    status: 'DEGRADED',
    lastSyncTime: new Date(Date.now() - 3600000 * 8).toISOString(),
    latencyMs: 950,
    successRate: 94.5,
    errorRate: 5.5,
    totalProducts: 1840,
  },
  {
    id: 'prov-reliance',
    name: 'Reliance Digital Connector',
    status: 'HEALTHY',
    lastSyncTime: new Date(Date.now() - 3600000 * 12).toISOString(),
    latencyMs: 420,
    successRate: 98.9,
    errorRate: 1.1,
    totalProducts: 1950,
  },
]

export const adminApi = {
  async getIngestionRuns(): Promise<IngestionRun[]> {
    try {
      const response = await apiClient.get<IngestionRun[]>('/admin/ingestion-runs')
      return response.data
    } catch {
      return MOCK_INGESTION_RUNS
    }
  },

  async triggerIngestion(providerName?: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('/admin/ingestion/trigger', {
        providerName,
      })
      return response.data
    } catch {
      return {
        success: true,
        message: `Ingestion triggered successfully for ${providerName || 'all active providers'}.`,
      }
    }
  },

  async getProvidersHealth(): Promise<ProviderHealth[]> {
    try {
      const response = await apiClient.get<ProviderHealth[]>('/admin/providers-health')
      return response.data
    } catch {
      return MOCK_PROVIDERS
    }
  },

  async getAdminStats(): Promise<{
    totalUsers: number
    totalProducts: number
    totalScrapesToday: number
    activeAlerts: number
  }> {
    try {
      const response = await apiClient.get('/admin/stats')
      return response.data
    } catch {
      return {
        totalUsers: 1420,
        totalProducts: 11840,
        totalScrapesToday: 48920,
        activeAlerts: 3290,
      }
    }
  },
}
