import React from 'react'
import { CheckCircle, AlertTriangle, XCircle, Clock, Play } from 'lucide-react'
import { IngestionRun } from '../../types'
import { formatTimeAgo } from '../../utils/formatDate'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export interface IngestionRunsTableProps {
  runs: IngestionRun[]
  onTriggerIngestion: () => void
  isTriggering?: boolean
}

export const IngestionRunsTable: React.FC<IngestionRunsTableProps> = ({
  runs,
  onTriggerIngestion,
  isTriggering = false,
}) => {
  const getStatusBadge = (status: IngestionRun['status']) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <Badge variant="success" size="sm" icon={<CheckCircle className="w-3 h-3" />}>
            Success
          </Badge>
        )
      case 'PARTIAL':
        return (
          <Badge variant="warning" size="sm" icon={<AlertTriangle className="w-3 h-3" />}>
            Partial
          </Badge>
        )
      case 'FAILED':
        return (
          <Badge variant="danger" size="sm" icon={<XCircle className="w-3 h-3" />}>
            Failed
          </Badge>
        )
      case 'RUNNING':
        return (
          <Badge variant="info" size="sm" icon={<Clock className="w-3 h-3 animate-spin" />}>
            Running
          </Badge>
        )
      default:
        return <Badge size="sm">{status}</Badge>
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
      <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-gray-900 text-base">Retailer Ingestion History</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Automated scheduled scraping and API catalog synchronization runs
          </p>
        </div>

        <Button
          onClick={onTriggerIngestion}
          isLoading={isTriggering}
          variant="primary"
          size="sm"
          leftIcon={<Play className="w-3.5 h-3.5" />}
        >
          Run Full Ingestion
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 font-semibold">Run ID</th>
              <th className="py-3 px-4 font-semibold">Provider / Job</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Scanned</th>
              <th className="py-3 px-4 font-semibold">Updated</th>
              <th className="py-3 px-4 font-semibold">New</th>
              <th className="py-3 px-4 font-semibold">Errors</th>
              <th className="py-3 px-4 font-semibold">Duration</th>
              <th className="py-3 px-4 font-semibold">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {runs.map((run) => (
              <tr key={run.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono text-xs text-gray-500">{run.id}</td>
                <td className="py-3.5 px-4 font-semibold text-gray-900">{run.providerName}</td>
                <td className="py-3.5 px-4">{getStatusBadge(run.status)}</td>
                <td className="py-3.5 px-4 font-medium text-gray-700">
                  {run.itemsScanned.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 font-medium text-emerald-600">
                  {run.itemsUpdated.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 font-medium text-blue-600">
                  +{run.itemsCreated.toLocaleString()}
                </td>
                <td className="py-3.5 px-4">
                  {run.errorsCount > 0 ? (
                    <span className="text-red-600 font-bold text-xs">{run.errorsCount}</span>
                  ) : (
                    <span className="text-gray-400 text-xs">0</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-xs text-gray-600">{run.durationSeconds}s</td>
                <td className="py-3.5 px-4 text-xs text-gray-500" title={run.startedAt}>
                  {formatTimeAgo(run.startedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default IngestionRunsTable
