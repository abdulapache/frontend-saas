import { Suspense } from 'react'
import { AccountsContent } from './AccountsContent'

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4 animate-pulse">
          <div className="w-6 h-6 border-2 border-blue-500 border-r-transparent rounded-full animate-spin" />
        </div>
        <p className="text-gray-600">Loading accounts...</p>
      </div>
    </div>
  )
}

export default function AccountsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AccountsContent />
    </Suspense>
  )
}
