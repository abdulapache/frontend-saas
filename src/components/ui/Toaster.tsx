'use client'

import { useToastStore } from '@/lib/hooks/useToast'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { clsx } from 'clsx'

export function Toaster() {
  const { toasts, dismiss } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-80 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={clsx(
            'flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-lg border text-sm font-medium pointer-events-auto',
            t.type === 'success' && 'bg-green-50  border-green-200 text-green-800',
            t.type === 'error'   && 'bg-red-50    border-red-200   text-red-800',
            t.type === 'info'    && 'bg-blue-50   border-blue-200  text-blue-800',
          )}
        >
          {t.type === 'success' && <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />}
          {t.type === 'error'   && <XCircle     size={16} className="text-red-500   flex-shrink-0 mt-0.5" />}
          {t.type === 'info'    && <Info        size={16} className="text-blue-500  flex-shrink-0 mt-0.5" />}
          <span className="flex-1 leading-snug">{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
