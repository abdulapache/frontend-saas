'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import apiClient from '@/lib/api/client'
import { useAuthStore } from '@/lib/store/authStore'
import { useToast } from '@/lib/hooks/useToast'
import {
  Users, UserPlus, Mail, Shield, Eye, Crown,
  MoreHorizontal, Check, X, Clock
} from 'lucide-react'
import { clsx } from 'clsx'
import { formatDistanceToNow } from 'date-fns'

interface TeamMember {
  id:        string
  firstName: string
  lastName:  string
  email:     string
  roles:     string[]
  createdAt: string
}

const ROLE_META: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  Admin:  { icon: Shield, color: 'text-purple-700', bg: 'bg-purple-100' },
  Member: { icon: Users,  color: 'text-blue-700',   bg: 'bg-blue-100'   },
  Viewer: { icon: Eye,    color: 'text-gray-600',   bg: 'bg-gray-100'   },
}

export default function TeamPage() {
  const queryClient       = useQueryClient()
  const { user }          = useAuthStore()
  const toast             = useToast()
  const [email, setEmail] = useState('')
  const [role, setRole]   = useState('Member')

  const { data, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn:  () => apiClient.get('/api/users?page=1&pageSize=100').then(r => r.data),
  })

  const inviteMutation = useMutation({
    mutationFn: () => apiClient.post('/api/users/invite', {
      email,
      role,
      teamId: '00000000-0000-0000-0000-000000000000',
    }),
    onSuccess: () => {
      toast.success(`Invitation sent to ${email}.`)
      setEmail('')
      queryClient.invalidateQueries({ queryKey: ['team-members'] })
    },
    onError: () => toast.error('Failed to send invitation. Check the email address.'),
  })

  const members: TeamMember[] = data?.items ?? []

  const stats = [
    { label: 'Total Members', value: members.length, icon: Users },
    { label: 'Admins',        value: members.filter(m => m.roles.includes('Admin')).length,  icon: Shield },
    { label: 'Members',       value: members.filter(m => m.roles.includes('Member')).length, icon: Users  },
    { label: 'Viewers',       value: members.filter(m => m.roles.includes('Viewer')).length, icon: Eye    },
  ]

  return (
    <MainLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your workspace members and permissions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <s.icon size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Invite card */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserPlus size={18} className="text-blue-500" />
            Invite Team Member
          </h2>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && email && inviteMutation.mutate()}
                className="input-field pl-10 w-full"
              />
            </div>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="input-field w-36"
            >
              <option value="Admin">Admin</option>
              <option value="Member">Member</option>
              <option value="Viewer">Viewer</option>
            </select>
            <button
              onClick={() => email && inviteMutation.mutate()}
              disabled={!email || inviteMutation.isPending}
              className="btn-primary flex items-center gap-2 flex-shrink-0"
            >
              {inviteMutation.isPending ? (
                'Sending…'
              ) : (
                <><UserPlus size={14} /> Invite</>
              )}
            </button>
          </div>

          {/* Role descriptions */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100">
            {[
              { role: 'Admin',  desc: 'Full access — create, publish, manage team & accounts' },
              { role: 'Member', desc: 'Create and schedule posts, view analytics'             },
              { role: 'Viewer', desc: 'Read-only: view posts and analytics'                   },
            ].map(({ role: r, desc }) => {
              const meta = ROLE_META[r]
              return (
                <div key={r} className={clsx('rounded-lg px-3 py-2.5 flex items-start gap-2', meta.bg)}>
                  <meta.icon size={14} className={clsx('mt-0.5 flex-shrink-0', meta.color)} />
                  <div>
                    <p className={clsx('text-xs font-semibold', meta.color)}>{r}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Members table */}
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              Members
              <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {members.length}
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-gray-400">Loading…</div>
          ) : members.length === 0 ? (
            <div className="py-12 text-center">
              <Users size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">No team members yet. Invite someone above!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {members.map(member => {
                const isCurrentUser = member.id === user?.id
                const primaryRole   = member.roles[0] ?? 'Member'
                const meta          = ROLE_META[primaryRole] ?? ROLE_META.Member

                return (
                  <div key={member.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 group">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {member.firstName[0]?.toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {member.firstName} {member.lastName}
                        </p>
                        {isCurrentUser && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">You</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{member.email}</p>
                    </div>

                    {/* Joined */}
                    <div className="hidden md:flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={11} />
                      Joined {formatDistanceToNow(new Date(member.createdAt), { addSuffix: true })}
                    </div>

                    {/* Role badges */}
                    <div className="flex gap-1.5">
                      {member.roles.map(r => {
                        const rm = ROLE_META[r]
                        if (!rm) return null
                        return (
                          <span key={r} className={clsx('flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full', rm.bg, rm.color)}>
                            <rm.icon size={11} />
                            {r}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
