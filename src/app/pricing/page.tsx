import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pricing — SocialHub Social Media Management',
  description: 'Simple, transparent pricing for every team size. Free plan with 2 channels. Professional at $19/mo with 10 channels. Business at $49/mo with 25 channels.',
  openGraph: {
    title: 'SocialHub Pricing — Plans for Every Team',
    description: 'Free, Professional, and Business plans. Manage up to 25 social channels.',
    type: 'website',
    url: 'https://socialhub.io/pricing',
  },
  alternates: {
    canonical: 'https://socialhub.io/pricing',
  },
}

import { CheckCircle, X, Zap, ArrowLeft } from 'lucide-react'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Get started with social media scheduling',
    highlight: false,
    channels: 2,
    users: 1,
    features: {
      'Social channels': '2',
      'Scheduled posts / month': '30',
      'Team members': '1',
      'Analytics': 'Basic (7 days)',
      'Bulk CSV upload': false,
      'Unified inbox': false,
      'Priority support': false,
      'Custom branding': false,
    },
    cta: 'Get started free',
    href: '/auth/register',
  },
  {
    name: 'Professional',
    price: '$19',
    period: '/month',
    desc: 'Perfect for freelancers and small businesses',
    highlight: true,
    channels: 10,
    users: 1,
    features: {
      'Social channels': '10',
      'Scheduled posts / month': 'Unlimited',
      'Team members': '1',
      'Analytics': 'Advanced (90 days)',
      'Bulk CSV upload': true,
      'Unified inbox': true,
      'Priority support': true,
      'Custom branding': false,
    },
    cta: 'Start 14-day free trial',
    href: '/auth/register',
  },
  {
    name: 'Business',
    price: '$49',
    period: '/month',
    desc: 'For agencies and growing teams',
    highlight: false,
    channels: 25,
    users: 5,
    features: {
      'Social channels': '25',
      'Scheduled posts / month': 'Unlimited',
      'Team members': '5',
      'Analytics': 'Full suite (1 year)',
      'Bulk CSV upload': true,
      'Unified inbox': true,
      'Priority support': true,
      'Custom branding': true,
    },
    cta: 'Start 14-day free trial',
    href: '/auth/register',
  },
]

const ALL_FEATURES = [
  'Social channels',
  'Scheduled posts / month',
  'Team members',
  'Analytics',
  'Bulk CSV upload',
  'Unified inbox',
  'Priority support',
  'Custom branding',
]

const FAQS = [
  {
    q: 'What counts as a social channel?',
    a: 'Each connected account counts as one channel. For example, 2 LinkedIn profiles + 1 Facebook page = 3 channels.',
  },
  {
    q: 'Can I change my plan later?',
    a: 'Yes. Upgrade or downgrade at any time. Changes take effect immediately.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Professional and Business plans include a 14-day free trial. No credit card required.',
  },
  {
    q: 'What platforms are supported?',
    a: 'LinkedIn, Facebook, Instagram, and Twitter/X. More platforms are coming soon.',
  },
  {
    q: 'Can I connect multiple accounts from the same platform?',
    a: 'Yes. You can connect multiple LinkedIn profiles, Facebook pages, or any combination up to your channel limit.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">SocialHub</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
              Sign in
            </Link>
            <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-20 px-6">
        {/* Back link */}
        <div className="max-w-6xl mx-auto mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft size={14} /> Back to home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-gray-500">Start free. No credit card required. Cancel anytime.</p>
        </div>

        {/* Cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-20">
          {PLANS.map(plan => (
            <div key={plan.name} className={`rounded-2xl border p-8 flex flex-col ${
              plan.highlight
                ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-100 scale-105'
                : 'bg-white border-gray-200 shadow-sm'
            }`}>
              {plan.highlight && (
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full self-start mb-4">
                  MOST POPULAR
                </span>
              )}
              <div className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-500'}`}>
                {plan.name}
              </div>
              <div className="flex items-end gap-1 mb-1">
                <span className={`text-5xl font-extrabold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                </span>
                <span className={`text-sm mb-2 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`text-sm mb-8 ${plan.highlight ? 'text-blue-200' : 'text-gray-500'}`}>{plan.desc}</p>

              <Link
                href={plan.href}
                className={`block text-center font-semibold py-3.5 rounded-xl transition-colors mb-8 ${
                  plan.highlight
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-3 flex-1">
                {ALL_FEATURES.map(feat => {
                  const val = plan.features[feat as keyof typeof plan.features]
                  return (
                    <li key={feat} className={`flex items-center gap-2.5 text-sm ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                      {val === false ? (
                        <X size={15} className={plan.highlight ? 'text-blue-400 flex-shrink-0' : 'text-gray-300 flex-shrink-0'} />
                      ) : (
                        <CheckCircle size={15} className={plan.highlight ? 'text-blue-300 flex-shrink-0' : 'text-green-500 flex-shrink-0'} />
                      )}
                      <span className={val === false ? 'opacity-50' : ''}>
                        {feat}{typeof val === 'string' ? `: ${val}` : ''}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Full plan comparison</h2>
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-4 font-semibold text-gray-700 w-1/3">Feature</th>
                  {PLANS.map(p => (
                    <th key={p.name} className={`px-6 py-4 font-bold text-center ${p.highlight ? 'text-blue-600' : 'text-gray-900'}`}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_FEATURES.map((feat, i) => (
                  <tr key={feat} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-6 py-3.5 text-gray-600">{feat}</td>
                    {PLANS.map(p => {
                      const val = p.features[feat as keyof typeof p.features]
                      return (
                        <td key={p.name} className="px-6 py-3.5 text-center">
                          {val === false ? (
                            <X size={16} className="text-gray-300 mx-auto" />
                          ) : val === true ? (
                            <CheckCircle size={16} className="text-green-500 mx-auto" />
                          ) : (
                            <span className={`font-medium ${p.highlight ? 'text-blue-600' : 'text-gray-800'}`}>{val}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQS.map(faq => (
              <div key={faq.q} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-600 rounded-3xl p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-3">Ready to get started?</h2>
          <p className="text-blue-200 mb-8">Join thousands of businesses that trust SocialHub.</p>
          <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors">
            Start for free today
          </Link>
        </div>
      </div>
    </div>
  )
}
