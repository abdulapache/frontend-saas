'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import apiClient from '@/lib/api/client'
import { useToast } from '@/lib/hooks/useToast'
import { Plus, Trash2, RefreshCw, CheckCircle, AlertCircle, ExternalLink, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface SocialAccount {
  id:             string
  platform:       string
  accountName:    string
  accountHandle:  string | null
  profilePicUrl:  string | null
  tokenExpiresAt: string | null
  createdAt:      string
}

const PLATFORM_META: Record<string, {
  color: string; bg: string; icon: string; description: string
}> = {
  Facebook:  { color: '#1877f2', bg: '#e7f3ff', icon: 'f',  description: 'Pages & profiles' },
  Instagram: { color: '#e1306c', bg: '#fce4ec', icon: '📷', description: 'Business accounts' },
  Twitter:   { color: '#1da1f2', bg: '#e3f2fd', icon: '𝕏',  description: 'X (Twitter) accounts' },
  LinkedIn:  { color: '#0077b5', bg: '#e3f0f7', icon: 'in', description: 'Company pages & profiles' },
  YouTube:   { color: '#ff0000', bg: '#fff0f0', icon: '▶',  description: 'Channels & shorts' },
  TikTok:    { color: '#010101', bg: '#f0f0f0', icon: '♪',  description: 'Creator accounts' },
  Bluesky:   { color: '#0085ff', bg: '#e6f2ff', icon: '🦋', description: 'AT Protocol profiles' },
}

export function AccountsContent() {
  const queryClient  = useQueryClient()
  const toast        = useToast()
  const searchParams = useSearchParams()
  const [blueskyModal, setBlueskyModal] = useState(false)
  const [blueskyHandle, setBlueskyHandle] = useState('')
  const [blueskyPass, setBlueskyPass]     = useState('')
  const [blueskyLoading, setBlueskyLoading] = useState(false)

  // Handle OAuth redirect back from platform
  useEffect(() => {
    const connected = searchParams.get('connected')
    const error     = searchParams.get('error')
    if (connected) {
      toast.success(`${connected} account connected successfully.`)
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] })
      window.history.replaceState({}, '', '/accounts')
    } else if (error) {
      toast.error(`Connection failed: ${error}`)
      window.history.replaceState({}, '', '/accounts')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data: accounts = [], isLoading } = useQuery<SocialAccount[]>({
    queryKey: ['social-accounts'],
    queryFn:  () => apiClient.get('/api/social-accounts').then(r => r.data),
  })

  const disconnectMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/social-accounts/${id}`),
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] })
      toast.success('Account disconnected.')
    },
    onError: () => toast.error('Failed to disconnect account.'),
  })

  const refreshTokenMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/api/social-accounts/${id}/refresh-token`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] })
      toast.success('Token refreshed successfully.')
    },
    onError: (_err: any, id: string) => {
      // Refresh failed — find the platform and do full reconnect
      const acc = accounts.find(a => a.id === id)
      if (acc) {
        toast.info(`Auto-refresh failed. Reconnecting ${acc.platform}…`)
        connectAccount(acc.platform)
      }
    },
  })

  const connectAccount = async (platform: string) => {
    try {
      const res = await apiClient.get(`/api/social-accounts/connect/${platform}`)

      if (res.data.demoMode) {
        await apiClient.post(`/api/social-accounts/connect-demo/${platform}`)
        queryClient.invalidateQueries({ queryKey: ['social-accounts'] })
        toast.success(`${platform} demo account connected.`)
        return
      }

      if (res.data.appPasswordFlow) {
        setBlueskyModal(true)
        return
      }

      window.location.href = res.data.authUrl
    } catch {
      toast.error(`Failed to connect ${platform}. Please try again.`)
    }
  }

  const connectBluesky = async () => {
    if (!blueskyHandle || !blueskyPass) return
    setBlueskyLoading(true)
    try {
      await apiClient.post('/api/social-accounts/connect/bluesky', {
        handle: blueskyHandle.replace(/^@/, ''),
        appPassword: blueskyPass,
      })
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] })
      toast.success('Bluesky account connected.')
      setBlueskyModal(false)
      setBlueskyHandle('')
      setBlueskyPass('')
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Failed to connect Bluesky.')
    } finally {
      setBlueskyLoading(false)
    }
  }

  const MAX_CHANNELS       = 10
  const usedChannels       = accounts.length
  const usagePct           = Math.min((usedChannels / MAX_CHANNELS) * 100, 100)
  const connectedPlatforms = new Set(accounts.map(a => a.platform))
  const atChannelLimit     = usedChannels >= MAX_CHANNELS

  const isTokenExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  return (
    <MainLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Social Accounts</h1>
            <p className="text-gray-500 text-sm mt-1">
              Connect your social media accounts to schedule and publish content.
            </p>
          </div>
          {/* Channel usage */}
          <div className="text-right min-w-[160px]">
            <p className="text-sm font-semibold text-gray-700">{usedChannels} / {MAX_CHANNELS} channels</p>
            <div className="mt-1.5 h-2 bg-gray-100 rounded-full overflow-hidden w-40">
              <div
                className={`h-full rounded-full transition-all ${usagePct >= 90 ? 'bg-red-500' : usagePct >= 70 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{MAX_CHANNELS - usedChannels} slots remaining</p>
          </div>
        </div>

        {/* Add new accounts */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Connect a Platform</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(PLATFORM_META).map(([platform, meta]) => {
              const isConnected = connectedPlatforms.has(platform)
              return (
                <div key={platform} className="card p-5 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{platform}</p>
                    <p className="text-xs text-gray-400">{meta.description}</p>
                    {isConnected && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                        <CheckCircle size={11} /> Connected
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => !atChannelLimit && connectAccount(platform)}
                    disabled={atChannelLimit && !isConnected}
                    title={atChannelLimit && !isConnected ? 'Channel limit reached — upgrade your plan' : undefined}
                    className={
                      isConnected
                        ? 'btn-secondary flex items-center gap-1.5 text-sm py-1.5 px-3'
                        : atChannelLimit
                          ? 'flex items-center gap-1.5 text-sm py-1.5 px-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed'
                          : 'btn-primary flex items-center gap-1.5 text-sm py-1.5 px-3'
                    }
                  >
                    {isConnected ? (
                      <><RefreshCw size={13} /> Add Another</>
                    ) : atChannelLimit ? (
                      <>Limit reached</>
                    ) : (
                      <><Plus size={13} /> Connect</>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Connected accounts list */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Connected Accounts
            <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {accounts.length}
            </span>
          </h2>

          {isLoading ? (
            <div className="card p-8 text-center text-gray-400">Loading accounts…</div>
          ) : accounts.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No accounts connected yet</p>
              <p className="text-gray-400 text-sm mt-1">Connect a platform above to get started</p>
            </div>
          ) : (
            <div className="card divide-y divide-gray-50">
              {accounts.map(acc => {
                const meta    = PLATFORM_META[acc.platform]
                const expired = isTokenExpired(acc.tokenExpiresAt)
                return (
                  <div key={acc.id} className="px-5 py-4 flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {acc.profilePicUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={acc.profilePicUrl}
                          alt={acc.accountName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{ background: meta?.bg ?? '#f3f4f6', color: meta?.color ?? '#6b7280' }}
                        >
                          {acc.accountName[0]?.toUpperCase()}
                        </div>
                      )}
                      <div
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px] font-bold"
                        style={{ background: meta?.color ?? '#6b7280' }}
                      >
                        {meta?.icon?.toString().slice(0, 1) ?? acc.platform[0]}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{acc.accountName}</p>
                      <p className="text-xs text-gray-400">
                        {acc.accountHandle && <span className="mr-2">{acc.accountHandle}</span>}
                        {acc.platform} · Connected {formatDistanceToNow(new Date(acc.createdAt), { addSuffix: true })}
                      </p>
                    </div>

                    {/* Status */}
                    {expired ? (
                      <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                        <AlertCircle size={12} /> Token expired
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                        <CheckCircle size={12} /> Active
                      </span>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {expired && (
                        <button
                          onClick={() => refreshTokenMutation.mutate(acc.id)}
                          disabled={refreshTokenMutation.isPending}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Refresh token"
                        >
                          <RefreshCw size={15} className={refreshTokenMutation.isPending ? 'animate-spin' : ''} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Disconnect ${acc.accountName}? Scheduled posts for this account will fail.`))
                            disconnectMutation.mutate(acc.id)
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Disconnect"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Bluesky app-password modal */}
        {blueskyModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: '#e6f2ff', color: '#0085ff' }}>🦋</div>
                  <h2 className="font-bold text-gray-900">Connect Bluesky</h2>
                </div>
                <button onClick={() => setBlueskyModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
                  <X size={18} />
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-5">
                Bluesky uses App Passwords for third-party access.{' '}
                <a href="https://bsky.app/settings/app-passwords" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Create one at bsky.app
                </a>{' '}
                then paste it below.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Handle</label>
                  <input
                    value={blueskyHandle}
                    onChange={e => setBlueskyHandle(e.target.value)}
                    placeholder="yourname.bsky.social"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">App Password</label>
                  <input
                    type="password"
                    value={blueskyPass}
                    onChange={e => setBlueskyPass(e.target.value)}
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setBlueskyModal(false)} className="flex-1 btn-secondary py-2.5 text-sm">
                  Cancel
                </button>
                <button
                  onClick={connectBluesky}
                  disabled={blueskyLoading || !blueskyHandle || !blueskyPass}
                  className="flex-1 btn-primary py-2.5 text-sm disabled:opacity-50"
                >
                  {blueskyLoading ? 'Connecting…' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Permissions info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <div className="flex gap-3">
            <ExternalLink size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">About permissions</p>
              <p className="text-sm text-blue-700 mt-1">
                SocialHub only requests the minimum permissions needed to publish content on your behalf.
                We never read private messages from platforms unless you use the Inbox feature, and we
                never share your credentials with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
