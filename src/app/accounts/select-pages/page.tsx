'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import apiClient from '@/lib/api/client'
import { CheckCircle, Loader2, AlertCircle, Facebook, Instagram } from 'lucide-react'

interface MetaChoice {
  id:       string
  name:     string
  username?: string
  picture?: string | null
}

function SelectPagesContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const platform   = searchParams.get('platform') ?? ''
  const accountKey = searchParams.get('accountKey') ?? ''

  const [choices,  setChoices]  = useState<MetaChoice[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    if (!platform || !accountKey) {
      setError('Missing platform or account key. Please try connecting again.')
      setLoading(false)
      return
    }

    apiClient
      .get(`/api/social-accounts/fetch-meta-choices/${platform}/${accountKey}`)
      .then(r => setChoices(r.data as MetaChoice[]))
      .catch(e => {
        const msg = e?.response?.data ?? e?.message ?? 'Failed to load accounts.'
        setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
      })
      .finally(() => setLoading(false))
  }, [platform, accountKey])

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleConfirm = async () => {
    if (selected.size === 0) return
    setSaving(true)
    setError(null)
    try {
      await apiClient.post('/api/social-accounts/save-selected-meta', {
        platform,
        accountKey,
        selectedIds: Array.from(selected),
      })
      router.push(`/accounts?connected=${platform}`)
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Failed to save selection.'
      setError(msg)
      setSaving(false)
    }
  }

  const isFacebook  = platform === 'Facebook'
  const isInstagram = platform === 'Instagram'
  const label       = isInstagram ? 'Instagram Business Accounts' : 'Facebook Pages'
  const accentColor = isFacebook ? '#1877f2' : '#e1306c'
  const accentBg    = isFacebook ? '#e7f3ff' : '#fce4ec'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: accentBg, color: accentColor }}
            >
              {isFacebook
                ? <Facebook size={18} />
                : <Instagram size={18} />
              }
            </div>
            <h1 className="text-lg font-bold text-gray-900">Select {label}</h1>
          </div>
          <p className="text-sm text-gray-500 ml-12">
            Choose which {label.toLowerCase()} to connect. You can select multiple.
          </p>
        </div>

        <div className="px-8 py-6">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 size={28} className="animate-spin text-blue-500" />
              <p className="text-sm text-gray-400">Loading {label.toLowerCase()}…</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-700">Something went wrong</p>
                <p className="text-xs text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && choices.length === 0 && (
            <div className="text-center py-10">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {isFacebook
                  ? <Facebook size={22} className="text-gray-400" />
                  : <Instagram size={22} className="text-gray-400" />
                }
              </div>
              <p className="text-sm font-medium text-gray-600">No {label.toLowerCase()} found</p>
              {isInstagram ? (
                <p className="text-xs text-gray-400 mt-2 max-w-xs mx-auto">
                  Your Instagram account must be a <strong>Professional (Business or Creator)</strong> account
                  and linked to a Facebook Page in Meta Business Settings.
                </p>
              ) : (
                <p className="text-xs text-gray-400 mt-2">
                  You must be an admin of at least one Facebook Page.
                </p>
              )}
              <button
                onClick={() => router.push('/accounts')}
                className="mt-5 text-sm text-blue-600 hover:underline"
              >
                Go back to accounts
              </button>
            </div>
          )}

          {/* Choice list */}
          {!loading && choices.length > 0 && (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {choices.map(c => {
                const isSelected = selected.has(c.id)
                return (
                  <button
                    key={c.id}
                    onClick={() => toggle(c.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {/* Avatar */}
                    {c.picture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.picture}
                        alt={c.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                        style={{ background: accentBg, color: accentColor }}
                      >
                        {c.name[0]?.toUpperCase()}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                      {c.username && (
                        <p className="text-xs text-gray-400 truncate">{c.username}</p>
                      )}
                    </div>

                    {/* Check */}
                    {isSelected
                      ? <CheckCircle size={18} className="text-blue-500 flex-shrink-0" />
                      : <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-200 flex-shrink-0" />
                    }
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!loading && choices.length > 0 && (
          <div className="px-8 pb-8 flex gap-3">
            <button
              onClick={() => router.push('/accounts')}
              disabled={saving}
              className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selected.size === 0 || saving}
              className="flex-1 py-2.5 text-sm rounded-xl text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: selected.size === 0 || saving ? undefined : accentColor }}
            >
              {saving ? (
                <><Loader2 size={15} className="animate-spin" /> Connecting…</>
              ) : (
                `Connect${selected.size > 0 ? ` (${selected.size})` : ''}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SelectPagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </div>
    }>
      <SelectPagesContent />
    </Suspense>
  )
}
