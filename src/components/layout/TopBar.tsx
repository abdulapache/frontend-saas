'use client'

import { useEffect, useState } from 'react'
import { Bell, Search } from 'lucide-react'
import { useSignalR } from '@/lib/hooks/useSignalR'
import apiClient from '@/lib/api/client'

interface Notification {
  id:        string
  title:     string
  body:      string
  type:      string
  isRead:    boolean
  createdAt: string
}

export function TopBar() {
  const { on } = useSignalR()
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifs, setShowNotifs]   = useState(false)
  const [notifs, setNotifs]           = useState<Notification[]>([])

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await apiClient.get('/api/notifications/unread-count')
        setUnreadCount(res.data.count)
      } catch {}
    }
    fetchUnread()

    // Listen for real-time notifications
    return on<Notification>('NotificationReceived', (notif) => {
      setNotifs(prev => [notif, ...prev])
      setUnreadCount(c => c + 1)
    })
  }, [on])

  const fetchNotifications = async () => {
    if (!showNotifs) {
      const res = await apiClient.get('/api/notifications?pageSize=10')
      setNotifs(res.data.items)
    }
    setShowNotifs(!showNotifs)
  }

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search posts, accounts..."
          className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={fetchNotifications}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                <button
                  className="text-xs text-blue-600 hover:text-blue-700"
                  onClick={() => {
                    apiClient.put('/api/notifications/read-all').then(() => setUnreadCount(0))
                  }}
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifs.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">No notifications</p>
                ) : (
                  notifs.map(n => (
                    <div key={n.id} className={`p-4 hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-blue-50/50' : ''}`}>
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
