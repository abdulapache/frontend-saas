import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'SocialHub — Social Media Management Platform',
  description: 'Schedule posts, manage 10+ social channels, track analytics, and collaborate with your team — all from one powerful dashboard. Free plan available.',
  keywords: ['social media management', 'social media scheduler', 'hootsuite alternative', 'schedule posts', 'social media analytics'],
  openGraph: {
    title: 'SocialHub — Manage All Your Social Media In One Place',
    description: 'Schedule posts, manage 10+ social channels, and track analytics from one dashboard.',
    type: 'website',
    url: 'https://socialhub.io',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialHub — Social Media Management Platform',
    description: 'Schedule posts, manage 10+ social channels, and track analytics from one dashboard.',
  },
  alternates: {
    canonical: 'https://socialhub.io',
  },
}

import {
  Calendar, BarChart2, Users, MessageSquare, Zap, Shield,
  CheckCircle, ArrowRight, Star, Globe, TrendingUp, Clock
} from 'lucide-react'

const PLATFORMS = [
  { name: 'LinkedIn',  color: '#0077b5', icon: 'in' },
  { name: 'Facebook',  color: '#1877f2', icon: 'f'  },
  { name: 'Instagram', color: '#e1306c', icon: '📷' },
  { name: 'Twitter',   color: '#1da1f2', icon: '𝕏'  },
  { name: 'YouTube',   color: '#ff0000', icon: '▶'  },
  { name: 'TikTok',    color: '#010101', icon: '♪'  },
  { name: 'Bluesky',   color: '#0085ff', icon: '🦋' },
]

const FEATURES = [
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    desc: 'Schedule posts across all platforms from one place. Set it once and let SocialHub handle the rest.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: BarChart2,
    title: 'Deep Analytics',
    desc: 'Track engagement, reach, and growth across every channel with unified dashboards.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: MessageSquare,
    title: 'Unified Inbox',
    desc: 'Manage comments, DMs, and mentions across all your social profiles from a single inbox.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    desc: 'Assign roles, review content, and collaborate with your team before anything goes live.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Zap,
    title: 'Bulk Publishing',
    desc: 'Upload a CSV and schedule dozens of posts in seconds. Perfect for content agencies.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    desc: 'OAuth 2.0 authentication with no password storage. Your accounts stay yours.',
    color: 'bg-red-50 text-red-600',
  },
]

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for personal use',
    channels: 2,
    posts: '30 posts/month',
    features: ['2 social channels', '30 scheduled posts/month', 'Basic analytics', '1 user'],
    cta: 'Get Started Free',
    href: '/auth/register',
    highlight: false,
  },
  {
    name: 'Professional',
    price: '$19',
    period: 'per month',
    desc: 'For growing businesses',
    channels: 10,
    posts: 'Unlimited posts',
    features: ['10 social channels', 'Unlimited scheduled posts', 'Advanced analytics', '1 user', 'Bulk upload CSV', 'Priority support'],
    cta: 'Start Free Trial',
    href: '/auth/register',
    highlight: true,
  },
  {
    name: 'Business',
    price: '$49',
    period: 'per month',
    desc: 'For teams & agencies',
    channels: 25,
    posts: 'Unlimited posts',
    features: ['25 social channels', 'Unlimited scheduled posts', 'Full analytics suite', '5 team members', 'Bulk upload CSV', 'Unified inbox', 'Priority support'],
    cta: 'Start Free Trial',
    href: '/auth/register',
    highlight: false,
  },
]

const STATS = [
  { value: '10+', label: 'Social channels supported' },
  { value: '500K+', label: 'Posts scheduled daily' },
  { value: '99.9%', label: 'Uptime guaranteed' },
  { value: '50K+', label: 'Happy customers' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ───────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">SocialHub</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#platforms" className="hover:text-gray-900 transition-colors">Platforms</a>
            <Link href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 transition-colors">
              Sign in
            </Link>
            <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Star size={14} /> Trusted by 50,000+ social media managers
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Manage all your social<br />
            <span className="text-blue-600">media in one place</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Schedule posts, track performance, and manage up to 10 social channels
            from a single powerful dashboard. Save hours every week.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-blue-200">
              Get started free <ArrowRight size={20} />
            </Link>
            <Link href="/auth/login" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold px-8 py-4 rounded-xl text-lg border border-gray-200 hover:border-gray-300 transition-colors">
              Sign in to dashboard
            </Link>
          </div>

          <p className="text-sm text-gray-400 mt-4">No credit card required · Free plan available</p>
        </div>

        {/* Mock dashboard preview */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 bg-white rounded border border-gray-200 px-3 py-1 text-xs text-gray-400">
                app.socialhub.io/dashboard
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-48 flex items-center justify-center">
              <div className="grid grid-cols-4 gap-4 w-full max-w-2xl">
                {[
                  { label: 'Scheduled', value: '24', color: 'bg-blue-500' },
                  { label: 'Published', value: '142', color: 'bg-green-500' },
                  { label: 'Reach', value: '48K', color: 'bg-purple-500' },
                  { label: 'Engagement', value: '3.2%', color: 'bg-orange-500' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                    <div className={`w-8 h-8 ${stat.color} rounded-lg mx-auto mb-2`} />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-extrabold text-white">{s.value}</div>
              <div className="text-blue-200 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Platforms ────────────────────────────────────── */}
      <section id="platforms" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect up to 10 social channels</h2>
          <p className="text-gray-500 mb-12">Post to all major platforms from one dashboard</p>

          <div className="flex flex-wrap justify-center gap-6">
            {PLATFORMS.map(p => (
              <div key={p.name} className="flex flex-col items-center gap-2">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                  style={{ backgroundColor: p.color }}
                >
                  {p.icon}
                </div>
                <span className="text-sm font-medium text-gray-600">{p.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 rounded-2xl p-6 inline-block">
            <div className="flex items-center gap-3 text-blue-700">
              <Globe size={20} />
              <span className="font-semibold">Connect the same platform multiple times</span>
            </div>
            <p className="text-blue-600 text-sm mt-1">
              Manage multiple Facebook pages, LinkedIn profiles, or Twitter accounts — all in one workspace.
            </p>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to grow</h2>
            <p className="text-gray-500 text-lg">All the tools Hootsuite offers, at a fraction of the price.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon size={22} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-14">Get started in 3 steps</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Users,    title: 'Create your account',   desc: 'Sign up free in 30 seconds. No credit card needed.' },
              { step: '02', icon: Globe,    title: 'Connect your channels', desc: 'Link LinkedIn, Facebook, Instagram and Twitter in one click.' },
              { step: '03', icon: Clock,    title: 'Schedule & publish',    desc: 'Write once, schedule across all platforms automatically.' },
            ].map(item => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-lg font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing preview ──────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, honest pricing</h2>
            <p className="text-gray-500">Start free. Upgrade when you're ready.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map(plan => (
              <div key={plan.name} className={`rounded-2xl p-8 border ${plan.highlight ? 'bg-blue-600 border-blue-600 shadow-xl scale-105' : 'bg-white border-gray-100 shadow-sm'}`}>
                {plan.highlight && (
                  <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                <div className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-500'}`}>
                  {plan.name}
                </div>
                <div className={`text-4xl font-extrabold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                </div>
                <div className={`text-sm mb-6 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>
                  {plan.period}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                      <CheckCircle size={15} className={plan.highlight ? 'text-blue-300 flex-shrink-0' : 'text-green-500 flex-shrink-0'} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center font-semibold py-3 rounded-xl transition-colors ${
                    plan.highlight
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 justify-center">
              See full pricing details <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-blue-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Start managing your social media smarter
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Join thousands of businesses saving time with SocialHub.
          </p>
          <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-lg">
            Get started for free <ArrowRight size={20} />
          </Link>
          <p className="text-blue-300 text-sm mt-4">No credit card required</p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="py-12 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">SocialHub</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/auth/login" className="hover:text-white transition-colors">Sign in</Link>
              <Link href="/auth/register" className="hover:text-white transition-colors">Sign up</Link>
            </div>

            <p className="text-gray-500 text-sm">© 2026 SocialHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
