'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { useAuthStore } from '@/lib/store/authStore'
import { useToast } from '@/lib/hooks/useToast'
import apiClient from '@/lib/api/client'
import {
  User, Lock, Users, Bell, AlertCircle,
  Mail, Trash2, Shield, Plus
} from 'lucide-react'
import { clsx } from 'clsx'

// ─── Sub-section tabs ─────────────────────────────────────────────────────────
const TABS = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'password',      label: 'Password',       icon: Lock },
  { id: 'team',          label: 'Team',           icon: Users },
  { id: 'notifications', label: 'Notifications',  icon: Bell },
]

// ─── Schemas ─────────────────────────────────────────────────────────────────
const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName:  z.string().min(1),
  avatarUrl: z.string().url().optional().or(z.literal('')),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(8)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match', path: ['confirmPassword']
})

const inviteSchema = z.object({
  email: z.string().email(),
  role:  z.enum(['Admin', 'Member', 'Viewer']),
})

type ProfileForm  = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>
type InviteForm   = z.infer<typeof inviteSchema>

// ─── Profile section ──────────────────────────────────────────────────────────
function ProfileSettings() {
  const { user, setUser } = useAuthStore()
  const toast = useToast()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName:  user?.lastName  ?? '',
      avatarUrl: user?.avatarUrl ?? '',
    },
  })

  const onSubmit = async (data: ProfileForm) => {
    try {
      const res = await apiClient.put('/api/users/me', data)
      setUser({ ...user!, ...res.data })
      toast.success('Profile updated successfully.')
    } catch {
      toast.error('Failed to update profile.')
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
        <p className="text-sm text-gray-500 mt-1">Update your name and avatar.</p>
      </div>

      {/* Avatar preview */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
          {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Roles: {user?.roles.join(', ')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
            <input {...register('firstName')} className="input-field" />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
            <input {...register('lastName')} className="input-field" />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Avatar URL</label>
          <input {...register('avatarUrl')} className="input-field" placeholder="https://…" />
          {errors.avatarUrl && <p className="text-red-500 text-xs mt-1">{errors.avatarUrl.message}</p>}
        </div>
        <div className="pt-2">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Danger zone */}
      <div className="border border-red-200 rounded-xl p-5 mt-6">
        <h3 className="text-sm font-semibold text-red-700 flex items-center gap-2 mb-3">
          <AlertCircle size={15} /> Danger Zone
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button className="btn-danger flex items-center gap-2 text-sm py-1.5">
          <Trash2 size={14} /> Delete Account
        </button>
      </div>
    </div>
  )
}

// ─── Password section ─────────────────────────────────────────────────────────
function PasswordSettings() {
  const toast = useToast()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = async (data: PasswordForm) => {
    try {
      await apiClient.post('/api/users/me/change-password', {
        currentPassword: data.currentPassword,
        newPassword:     data.newPassword,
      })
      toast.success('Password changed successfully.')
      reset()
    } catch {
      toast.error('Current password is incorrect.')
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
        <p className="text-sm text-gray-500 mt-1">Ensure your account uses a strong password.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
          <input type="password" {...register('currentPassword')} className="input-field" />
          {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
          <input type="password" {...register('newPassword')} className="input-field" placeholder="Min 8 chars, 1 uppercase, 1 number" />
          {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
          <input type="password" {...register('confirmPassword')} className="input-field" />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <div className="pt-2">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Changing…' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Team section ─────────────────────────────────────────────────────────────
function TeamSettings() {
  const queryClient = useQueryClient()
  const toast = useToast()

  const { data: team } = useQuery({
    queryKey: ['team'],
    queryFn:  () => apiClient.get('/api/users?page=1&pageSize=50').then(r => r.data),
  })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: 'Member' },
  })

  const inviteMutation = useMutation({
    mutationFn: (data: InviteForm) =>
      apiClient.post('/api/users/invite', { ...data, teamId: '00000000-0000-0000-0000-000000000000' }),
    onSuccess: () => {
      toast.success('Invitation sent successfully.')
      reset()
      queryClient.invalidateQueries({ queryKey: ['team'] })
    },
    onError: () => toast.error('Failed to send invitation.'),
  })

  const ROLE_COLORS: Record<string, string> = {
    Admin:  'bg-purple-100 text-purple-700',
    Member: 'bg-blue-100 text-blue-700',
    Viewer: 'bg-gray-100 text-gray-600',
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Team Management</h2>
        <p className="text-sm text-gray-500 mt-1">Invite people and manage their roles.</p>
      </div>

      {/* Invite form */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus size={15} /> Invite a Team Member
        </h3>
        <form onSubmit={handleSubmit(d => inviteMutation.mutate(d))} className="flex gap-3">
          <div className="flex-1">
            <input
              type="email"
              {...register('email')}
              placeholder="colleague@company.com"
              className="input-field"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <select {...register('role')} className="input-field w-32">
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
            <option value="Viewer">Viewer</option>
          </select>
          <button
            type="submit"
            disabled={isSubmitting || inviteMutation.isPending}
            className="btn-primary flex items-center gap-2 flex-shrink-0"
          >
            <Mail size={14} />
            {inviteMutation.isPending ? 'Sending…' : 'Invite'}
          </button>
        </form>
      </div>

      {/* Role descriptions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { role: 'Admin',  icon: Shield, desc: 'Full access: create, edit, publish, manage team' },
          { role: 'Member', icon: User,   desc: 'Can create and schedule posts, view analytics' },
          { role: 'Viewer', icon: User,   desc: 'Read-only: view posts and analytics only' },
        ].map(({ role, icon: Icon, desc }) => (
          <div key={role} className="card p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon size={14} className="text-gray-400" />
              <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', ROLE_COLORS[role])}>
                {role}
              </span>
            </div>
            <p className="text-xs text-gray-500">{desc}</p>
          </div>
        ))}
      </div>

      {/* Team members list */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Members</h3>
        <div className="card divide-y divide-gray-50">
          {(team?.items ?? []).map((member: {
            id: string; firstName: string; lastName: string;
            email: string; roles: string[]
          }) => (
            <div key={member.id} className="px-4 py-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {member.firstName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-xs text-gray-400">{member.email}</p>
              </div>
              {member.roles.map(role => (
                <span key={role} className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', ROLE_COLORS[role] ?? 'bg-gray-100 text-gray-600')}>
                  {role}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Notifications section ────────────────────────────────────────────────────
function NotificationSettings() {
  const toast = useToast()
  const [prefs, setPrefs] = useState({
    postPublished:  true,
    postFailed:     true,
    newMessage:     true,
    teamInvite:     true,
    weeklyReport:   false,
    emailDigest:    true,
  })

  const toggle = (key: keyof typeof prefs) =>
    setPrefs(p => ({ ...p, [key]: !p[key] }))

  const groups = [
    {
      title: 'Post Alerts',
      items: [
        { key: 'postPublished' as const, label: 'Post published successfully', desc: 'When a scheduled post goes live' },
        { key: 'postFailed'    as const, label: 'Post failed to publish',      desc: 'When publishing encounters an error' },
      ],
    },
    {
      title: 'Inbox',
      items: [
        { key: 'newMessage' as const, label: 'New message received', desc: 'When someone sends you a social message' },
      ],
    },
    {
      title: 'Team',
      items: [
        { key: 'teamInvite' as const, label: 'Team invitations', desc: 'When you receive a team invitation' },
      ],
    },
    {
      title: 'Reports',
      items: [
        { key: 'weeklyReport' as const, label: 'Weekly performance report', desc: 'Summary of your weekly analytics' },
        { key: 'emailDigest'  as const, label: 'Email digest',              desc: 'Daily digest of important updates' },
      ],
    },
  ]

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
        <p className="text-sm text-gray-500 mt-1">Choose which notifications you want to receive.</p>
      </div>

      <div className="space-y-6">
        {groups.map(group => (
          <div key={group.title}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {group.title}
            </h3>
            <div className="card divide-y divide-gray-50">
              {group.items.map(item => (
                <div key={item.key} className="px-4 py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggle(item.key)}
                    className={clsx(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
                      prefs[item.key] ? 'bg-blue-600' : 'bg-gray-200'
                    )}
                  >
                    <span className={clsx(
                      'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                      prefs[item.key] ? 'translate-x-6' : 'translate-x-1'
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => toast.success('Notification preferences saved.')}
        className="btn-primary"
      >
        Save Preferences
      </button>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <MainLayout>
      <div className="max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account and workspace preferences</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar nav */}
          <div className="w-48 flex-shrink-0">
            <nav className="space-y-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    activeTab === id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'profile'       && <ProfileSettings />}
            {activeTab === 'password'      && <PasswordSettings />}
            {activeTab === 'team'          && <TeamSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
