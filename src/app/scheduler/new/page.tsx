'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import { postsApi } from '@/lib/api/posts'
import { useToast } from '@/lib/hooks/useToast'
import apiClient from '@/lib/api/client'
import { Image, X, Calendar, Send, Save, Upload } from 'lucide-react'
import { format } from 'date-fns'

const PLATFORMS = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn']

export default function NewPostPage() {
  const router = useRouter()
  const toast  = useToast()
  const [content,    setContent]    = useState('')
  const [title,      setTitle]      = useState('')
  const [tags,       setTags]       = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [mediaFiles, setMediaFiles] = useState<Array<{ id: string; url: string; fullUrl: string; type: string }>>([])
  const [uploading, setUploading]   = useState(false)

  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['social-accounts'],
    queryFn:  () => apiClient.get('/api/social-accounts').then(r => r.data),
    retry: false,
  })

  const createMutation = useMutation({
    mutationFn: postsApi.create,
    onSuccess: () => {
      toast.success(scheduledAt ? 'Post scheduled successfully.' : 'Post saved as draft.')
      router.push('/scheduler')
    },
    onError: () => toast.error('Failed to create post. Please try again.'),
  })

  const onDrop = useCallback(async (files: File[]) => {
    setUploading(true)
    try {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f))
      const res = await apiClient.post('/api/media/upload-multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMediaFiles(prev => [...prev, ...res.data.map((m: { id: string; mediaUrl: string; mediaType: string }) => ({
        id:      m.id,
        url:     (() => { try { return new URL(m.mediaUrl).pathname } catch { return m.mediaUrl } })(),
        fullUrl: m.mediaUrl,
        type:    m.mediaType,
      }))])
      toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded.`)
    } catch {
      toast.error('Media upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }, [toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    maxFiles: 4,
  })

  const toggleAccount = (id: string) =>
    setSelectedAccounts(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])

  const getPlatformForAccount = (accountId: string): string =>
    accounts?.find((a: { id: string; platform: string }) => a.id === accountId)?.platform ?? 'Unknown'

  const handleSubmit = async (asDraft: boolean) => {
    if (!content.trim()) {
      toast.error('Post content cannot be empty.')
      return
    }

    const selectedPlatforms = selectedAccounts.map(getPlatformForAccount)

    await createMutation.mutateAsync({
      content,
      title:            title || undefined,
      scheduledAt:      asDraft ? undefined : (scheduledAt || undefined),
      socialAccountIds: selectedAccounts,
      platforms:        selectedPlatforms,
      tags:             tags.split(',').map(t => t.trim()).filter(Boolean),
      mediaItems:       mediaFiles.map((m, i) => ({
        id: m.id, mediaUrl: m.fullUrl, mediaType: m.type, sortOrder: i
      })),
    })
  }

  const charCount = content.length
  const maxChars  = 5000

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-500 text-sm mt-1">Compose and schedule your content</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Composer */}
          <div className="col-span-2 space-y-4">
            <div className="card p-5 space-y-4">
              <input
                type="text"
                placeholder="Post title (optional)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="input-field text-base font-medium"
              />

              <div className="relative">
                <textarea
                  placeholder="What do you want to share? Use engaging content that resonates with your audience..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={6}
                  maxLength={maxChars}
                  className="input-field resize-none w-full"
                />
                <span className={`absolute bottom-2 right-2 text-xs ${charCount > maxChars * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}>
                  {charCount}/{maxChars}
                </span>
              </div>

              {/* Tags */}
              <input
                type="text"
                placeholder="Tags (comma separated): marketing, social, brand"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="input-field"
              />

              {/* Media Upload */}
              <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {uploading ? 'Uploading...' : isDragActive ? 'Drop files here...' : 'Drag & drop images/videos or click to browse'}
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, MP4 · Max 100MB each · Up to 4 files</p>
              </div>

              {/* Media Preview */}
              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {mediaFiles.map((m) => (
                    <div key={m.id} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {m.type.startsWith('video/') ? (
                        <video src={m.url} className="w-full h-full object-cover" muted playsInline />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.url} alt="media" className="w-full h-full object-cover" />
                      )}
                      <button
                        onClick={() => setMediaFiles(prev => prev.filter(f => f.id !== m.id))}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 flex transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Schedule */}
            <div className="card p-5">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" />
                Schedule
              </h3>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Leave empty to save as draft
              </p>
            </div>
          </div>

          {/* Sidebar: Account Selection */}
          <div className="space-y-4">
            <div className="card p-4">
              <h3 className="font-medium text-gray-900 mb-3">Publish to</h3>
              {accountsLoading ? (
                <div className="text-center py-4">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-gray-400 mt-2">Loading accounts...</p>
                </div>
              ) : !accounts || accounts.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No accounts connected.</p>
                  <a href="/accounts" className="text-blue-600 text-sm hover:underline">Connect accounts →</a>
                </div>
              ) : (
                <div className="space-y-2">
                  {accounts.map((acc: { id: string; platform: string; accountName: string; profilePicUrl: string | null }) => (
                    <label key={acc.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer border transition-colors ${
                        selectedAccounts.includes(acc.id)
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAccounts.includes(acc.id)}
                        onChange={() => toggleAccount(acc.id)}
                        className="hidden"
                      />
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {acc.platform[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{acc.accountName}</p>
                        <p className="text-xs text-gray-400">{acc.platform}</p>
                      </div>
                      {selectedAccounts.includes(acc.id) && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => handleSubmit(false)}
                disabled={!content.trim() || selectedAccounts.length === 0 || createMutation.isPending}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Send size={14} />
                {scheduledAt ? 'Schedule Post' : 'Publish Now'}
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={!content.trim() || createMutation.isPending}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Save size={14} />
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
