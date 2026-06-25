'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { useQuery, useMutation } from '@tanstack/react-query'
import { postsApi } from '@/lib/api/posts'
import { useToast } from '@/lib/hooks/useToast'
import { Save, X, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface Props {
  params: { id: string }
}

export default function EditPostPage({ params }: Props) {
  const { id }  = params
  const router  = useRouter()
  const toast   = useToast()

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn:  () => postsApi.getById(id),
  })

  const [content,     setContent]     = useState('')
  const [title,       setTitle]       = useState('')
  const [tags,        setTags]        = useState('')
  const [scheduledAt, setScheduledAt] = useState('')

  useEffect(() => {
    if (post) {
      setContent(post.content)
      setTitle(post.title ?? '')
      setTags(post.tags.join(', '))
      if (post.scheduledAt) {
        const local = new Date(post.scheduledAt)
        setScheduledAt(format(local, "yyyy-MM-dd'T'HH:mm"))
      }
    }
  }, [post])

  const updateMutation = useMutation({
    mutationFn: (data: { content: string; title?: string; scheduledAt?: string; tags?: string[] }) =>
      postsApi.update(id, data),
    onSuccess: () => {
      toast.success('Post updated successfully.')
      router.push('/scheduler')
    },
    onError: () => toast.error('Failed to update post. Please try again.'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({
      content,
      title:       title || undefined,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      tags:        tags.split(',').map(t => t.trim()).filter(Boolean),
    })
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading post…</div>
        </div>
      </MainLayout>
    )
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <p className="text-gray-500">Post not found.</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
            <p className="text-gray-500 text-sm mt-1">
              {post.targets.map(t => t.platform).join(' · ')}
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="btn-secondary flex items-center gap-2"
          >
            <X size={14} /> Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="card p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Title <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="input-field"
                placeholder="Give your post a title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Content <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={7}
                  maxLength={5000}
                  required
                  className="input-field resize-none w-full"
                  placeholder="What do you want to share?"
                />
                <span className={`absolute bottom-2 right-2 text-xs ${content.length > 4500 ? 'text-orange-500' : 'text-gray-400'}`}>
                  {content.length}/5000
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tags <span className="text-gray-400 font-normal">(comma separated)</span>
              </label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="input-field"
                placeholder="marketing, brand, launch"
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="card p-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Calendar size={15} className="text-blue-500" />
              Scheduled Time
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              className="input-field"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Leave unchanged to keep the current schedule, or clear to revert to draft.
            </p>
          </div>

          {/* Targets (read-only info) */}
          <div className="card p-5">
            <p className="text-sm font-medium text-gray-700 mb-3">Publishing to</p>
            <div className="flex flex-wrap gap-2">
              {post.targets.map(t => (
                <span
                  key={t.id}
                  className={`platform-badge ${
                    t.platform === 'Facebook'  ? 'platform-facebook'  :
                    t.platform === 'Instagram' ? 'platform-instagram' :
                    t.platform === 'Twitter'   ? 'platform-twitter'   :
                    t.platform === 'LinkedIn'  ? 'platform-linkedin'  : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {t.platform}
                  <span className={`ml-1 text-[10px] ${
                    t.status === 'Published' ? 'text-green-500' :
                    t.status === 'Failed'    ? 'text-red-500'   : 'text-current opacity-60'
                  }`}>
                    ({t.status})
                  </span>
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Target platforms cannot be changed after creation.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!content.trim() || updateMutation.isPending}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={14} />
              {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
