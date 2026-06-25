import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — SocialHub',
  description: 'Sign in to SocialHub to manage your social media accounts, schedule posts, and track analytics.',
  robots: { index: false, follow: false },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
