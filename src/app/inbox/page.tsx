'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { useSignalR } from '@/lib/hooks/useSignalR'
import { useToast } from '@/lib/hooks/useToast'
import apiClient from '@/lib/api/client'
import { Send, Search, Filter, User, Clock, CheckCheck, MessageSquare } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { clsx } from 'clsx'

interface Message {
  id:               string
  socialAccountId:  string
  platform:         string
  externalId:       string
  senderName:       string | null
  senderProfileUrl: string | null
  content:          string
  isRead:           boolean
  isReplied:        boolean
  assignedToUserId: string | null
  receivedAt:       string
  replies:          Reply[]
}

interface Reply {
  id:      string
  userId:  string
  content: string
  sentAt:  string
}

const PLATFORM_COLORS: Record<string, string> = {
  Facebook:  'bg-blue-500',
  Instagram: 'bg-pink-500',
  Twitter:   'bg-sky-500',
  LinkedIn:  'bg-blue-700',
}

export default function InboxPage() {
  const queryClient                 = useQueryClient()
  const { on }                      = useSignalR()
  const toast                       = useToast()
  const [selected, setSelected]     = useState<Message | null>(null)
  const [replyText, setReplyText]   = useState('')
  const [platform, setPlatform]     = useState<string | undefined>(undefined)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [search, setSearch]         = useState('')
  const messagesEndRef              = useRef<HTMLDivElement>(null)

  const { data } = useQuery({
    queryKey: ['messages', platform, unreadOnly],
    queryFn:  () => apiClient.get('/api/messages', {
      params: { platform, unread: unreadOnly, pageSize: 50 }
    }).then(r => r.data),
    refetchInterval: 30_000,
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => apiClient.put(`/api/messages/${id}/read`),
  })

  const replyMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      apiClient.post(`/api/messages/${id}/reply`, { content }),
    onSuccess: () => {
      setReplyText('')
      toast.success('Reply sent.')
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      if (selected) refetchSelected()
    },
    onError: () => toast.error('Failed to send reply. Please try again.'),
  })

  const { data: selectedDetail, refetch: refetchSelected } = useQuery({
    queryKey: ['message', selected?.id],
    queryFn:  () => selected ? apiClient.get(`/api/messages/${selected.id}`).then(r => r.data) : null,
    enabled:  !!selected,
  })

  useEffect(() => {
    return on<Message>('MessageReceived', () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      toast.info('New message received.')
    })
  }, [on, queryClient, toast])

  const selectMessage = (msg: Message) => {
    setSelected(msg)
    if (!msg.isRead) markReadMutation.mutate(msg.id)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedDetail?.replies])

  const messages: Message[] = (data?.items ?? []).filter((m: Message) =>
    !search || m.senderName?.toLowerCase().includes(search.toLowerCase()) ||
    m.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-3.5rem-3rem)] -m-6 overflow-hidden">

        {/* ── Left panel: message list ───────────────────────────── */}
        <div className="w-80 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h1 className="text-lg font-bold text-gray-900 mb-3">Unified Inbox</h1>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[undefined, 'Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map(p => (
                <button
                  key={p ?? 'all'}
                  onClick={() => setPlatform(p)}
                  className={clsx(
                    'px-2.5 py-1 text-xs rounded-full font-medium transition-colors',
                    platform === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {p ?? 'All'}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">{messages.length} messages</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={e => setUnreadOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded"
              />
              <span className="text-xs text-gray-600">Unread only</span>
            </label>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {messages.length === 0 ? (
              <div className="py-16 text-center">
                <MessageSquare size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No messages yet</p>
              </div>
            ) : (
              messages.map((msg: Message) => (
                <button
                  key={msg.id}
                  onClick={() => selectMessage(msg)}
                  className={clsx(
                    'w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors',
                    selected?.id === msg.id && 'bg-blue-50 border-r-2 border-blue-500',
                    !msg.isRead && 'bg-blue-50/40'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-sm font-bold">
                        {msg.senderName?.[0]?.toUpperCase() ?? <User size={16} />}
                      </div>
                      <div className={clsx(
                        'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white',
                        PLATFORM_COLORS[msg.platform] ?? 'bg-gray-400'
                      )} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className={clsx(
                          'text-sm truncate',
                          !msg.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                        )}>
                          {msg.senderName ?? 'Unknown'}
                        </span>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formatDistanceToNow(new Date(msg.receivedAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{msg.content}</p>
                    </div>

                    {!msg.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Right panel: conversation ──────────────────────────── */}
        {selected ? (
          <div className="flex-1 flex flex-col bg-gray-50">
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={clsx(
                  'w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold',
                  PLATFORM_COLORS[selected.platform] ?? 'bg-gray-400'
                )}>
                  {selected.senderName?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{selected.senderName ?? 'Unknown'}</p>
                  <p className="text-xs text-gray-400">{selected.platform} · {formatDistanceToNow(new Date(selected.receivedAt), { addSuffix: true })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selected.isReplied && (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <CheckCheck size={12} /> Replied
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {selected.senderName?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="max-w-[70%]">
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-800">{selectedDetail?.content ?? selected.content}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-1">
                    {formatDistanceToNow(new Date(selected.receivedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {(selectedDetail?.replies ?? []).map((reply: Reply) => (
                <div key={reply.id} className="flex gap-3 justify-end">
                  <div className="max-w-[70%]">
                    <div className="bg-blue-600 rounded-2xl rounded-tr-sm px-4 py-3">
                      <p className="text-sm text-white">{reply.content}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right mr-1">
                      {formatDistanceToNow(new Date(reply.sentAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    You
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t border-gray-100 p-4">
              <div className="flex gap-3">
                <textarea
                  rows={2}
                  placeholder={`Reply via ${selected.platform}…`}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && replyText.trim()) {
                      replyMutation.mutate({ id: selected.id, content: replyText })
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                  onClick={() => {
                    if (replyText.trim())
                      replyMutation.mutate({ id: selected.id, content: replyText })
                  }}
                  disabled={!replyText.trim() || replyMutation.isPending}
                  className="self-end btn-primary flex items-center gap-2 px-4"
                >
                  <Send size={14} />
                  {replyMutation.isPending ? 'Sending…' : 'Send'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">⌘ + Enter to send</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare size={48} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">Select a message to read</p>
              <p className="text-gray-300 text-sm mt-1">All your social messages in one place</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
