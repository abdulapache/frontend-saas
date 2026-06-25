import Link from 'next/link'
import { Zap } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — SocialHub',
  description: 'How SocialHub collects, uses, and protects your data.',
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </section>
)

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Nav ── */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">SocialHub</span>
          </Link>
          <div className="flex items-center gap-5 text-sm text-gray-500">
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
            <Link href="/auth/login" className="hover:text-gray-900 transition-colors">Sign in</Link>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-16">
        <div className="mb-12">
          <p className="text-sm font-medium text-blue-600 mb-2">Legal</p>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-500 text-sm">Effective date: June 12, 2026 · Last updated: June 12, 2026</p>
        </div>

        <p className="text-gray-600 leading-relaxed mb-10">
          SocialHub (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the SocialHub social media management
          platform. This Privacy Policy explains how we collect, use, disclose, and protect your
          information when you use our service. By using SocialHub you agree to the collection
          and use of information in accordance with this policy.
        </p>

        <Section title="1. Information We Collect">
          <p><strong>Account information.</strong> When you register, we collect your name, email address, and password (hashed). We never store plain-text passwords.</p>
          <p><strong>Social media credentials.</strong> When you connect a social platform (Facebook, Instagram, TikTok, Twitter/X, LinkedIn, YouTube, Bluesky), we store the OAuth access tokens and refresh tokens issued by that platform. We do not store your social media passwords.</p>
          <p><strong>Content you create.</strong> Posts, captions, images, videos, and scheduled publishing data you upload or compose inside SocialHub.</p>
          <p><strong>Usage data.</strong> Pages visited, features used, timestamps, IP address, browser type, and device information for security and analytics purposes.</p>
          <p><strong>Uploaded media.</strong> Images and videos you attach to posts are temporarily stored on our servers to facilitate publishing. Media is removed after it has been published or the post is deleted.</p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Create and manage your account</li>
            <li>Publish scheduled content to connected social media platforms on your behalf</li>
            <li>Sync analytics, comments, and engagement metrics from your social accounts</li>
            <li>Send important service notifications (password resets, security alerts)</li>
            <li>Improve and secure the platform</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p>We will never sell your personal data or use it for advertising purposes.</p>
        </Section>

        <Section title="3. Social Platform Permissions">
          <p>
            When you connect a social media account, you grant SocialHub specific permissions on that
            platform (e.g., <em>pages_manage_posts</em> for Facebook Pages,{' '}
            <em>instagram_content_publish</em> for Instagram). We request only the minimum permissions
            required to provide the publishing and analytics features you have enabled.
          </p>
          <p>
            You can revoke these permissions at any time from within each platform&apos;s security
            settings, or by disconnecting the account inside SocialHub. Revoking permissions will
            prevent SocialHub from publishing or syncing that account.
          </p>
        </Section>

        <Section title="4. Data Sharing &amp; Third Parties">
          <p>We do not sell, rent, or trade your personal information. We share data only in these limited circumstances:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Social platforms.</strong> Content and tokens are transmitted to the platform APIs (Meta, TikTok, Twitter/X, LinkedIn, Google, Bluesky) solely to execute publishing and sync requests you initiate.</li>
            <li><strong>Infrastructure providers.</strong> We use Supabase (database), Vercel/cloud hosting (frontend), and similar services bound by data processing agreements.</li>
            <li><strong>Legal requirements.</strong> We may disclose data when required by law or to protect the rights, safety, or property of SocialHub and its users.</li>
          </ul>
        </Section>

        <Section title="5. Data Retention">
          <p>We retain your account data for as long as your account is active. When you delete your account:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your profile, posts, and social account connections are permanently deleted within 30 days.</li>
            <li>Uploaded media files are deleted immediately.</li>
            <li>We may retain anonymised usage statistics that cannot identify you.</li>
          </ul>
        </Section>

        <Section title="6. Security">
          <p>
            We implement industry-standard security measures including TLS encryption in transit,
            bcrypt password hashing, JWT-based session authentication, and access controls on our
            database. OAuth tokens are stored encrypted at rest.
          </p>
          <p>
            No method of transmission over the internet is 100% secure. While we strive to protect
            your data, we cannot guarantee absolute security. Please use a strong, unique password
            and enable two-factor authentication on your connected social accounts.
          </p>
        </Section>

        <Section title="7. Cookies &amp; Local Storage">
          <p>
            SocialHub uses cookies and browser local storage to maintain your login session (JWT
            access and refresh tokens). We do not use advertising or tracking cookies. You can
            disable cookies in your browser, but this will prevent you from staying logged in.
          </p>
        </Section>

        <Section title="8. Your Rights">
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data (&quot;right to be forgotten&quot;)</li>
            <li>Data portability (export your posts and account data)</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p>To exercise these rights, contact us at the email below.</p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            SocialHub is not directed to children under 13 years of age. We do not knowingly collect
            personal information from children. If we become aware that a child under 13 has provided
            us with personal information, we will delete it immediately.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant
            changes by email or by a prominent notice on the service before the change becomes
            effective. Your continued use of SocialHub after the effective date constitutes
            acceptance of the updated policy.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>If you have questions about this Privacy Policy or how we handle your data, please contact us:</p>
          <div className="bg-gray-50 rounded-xl p-5 mt-2 text-sm">
            <p className="font-semibold text-gray-800">SocialHub Support</p>
            <p>Email: <a href="mailto:privacy@socialhub.io" className="text-blue-600 hover:underline">privacy@socialhub.io</a></p>
          </div>
        </Section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© 2026 SocialHub. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-blue-600 font-medium">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
