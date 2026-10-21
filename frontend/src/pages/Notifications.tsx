import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  CheckCircle,
  TrendingDown,
  Sparkles,
  Info,
  PackageCheck,
  ExternalLink,
  CheckCheck,
} from 'lucide-react'
import { alertsApi } from '../api/alerts'
import { Notification } from '../types'
import { formatTimeAgo } from '../utils/formatDate'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await alertsApi.getNotifications()
        setNotifications(data)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id: string) => {
    await alertsApi.markNotificationAsRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const handleMarkAllAsRead = async () => {
    await alertsApi.markAllNotificationsAsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.isRead : true))
  const unreadCount = notifications.filter((n) => !n.isRead).length

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'PRICE_DROP':
        return <TrendingDown className="w-5 h-5 text-emerald-600" />
      case 'DEAL_ALERT':
        return <Sparkles className="w-5 h-5 text-amber-500" />
      case 'BACK_IN_STOCK':
        return <PackageCheck className="w-5 h-5 text-blue-600" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            Alerts & Notifications
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time triggers from your target price alerts and significant price drops
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            leftIcon={<CheckCheck className="w-4 h-4" />}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`pb-3 text-sm font-semibold border-b-2 px-2 transition-colors ${
            filter === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`pb-3 text-sm font-semibold border-b-2 px-2 transition-colors flex items-center gap-1.5 ${
            filter === 'unread'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="py-16 flex items-center justify-center">
          <Spinner size="lg" message="Loading notifications..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-1">No Notifications</h3>
          <p className="text-xs text-gray-400">
            {filter === 'unread'
              ? 'You have caught up with all notifications.'
              : 'You have no price alert notifications yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all flex items-start gap-4 ${
                item.isRead
                  ? 'bg-white border-gray-200 opacity-80'
                  : 'bg-blue-50/40 border-blue-200 shadow-xs'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatTimeAgo(item.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.message}</p>

                <div className="flex items-center gap-3 mt-3 pt-2 border-t border-gray-100">
                  {item.linkUrl && (
                    <Link
                      to={item.linkUrl}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <span>View Deal</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}

                  {!item.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
