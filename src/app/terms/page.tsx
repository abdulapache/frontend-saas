import Link from 'next/link'
import { Zap } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — SocialHub',
  description: 'Terms and conditions for using the SocialHub platform.',
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </section>
)

export default function TermsPage() {
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
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link href="/auth/login" className="hover:text-gray-900 transition-colors">Sign in</Link>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-16">
        <div className="mb-12">
          <p className="text-sm font-medium text-blue-600 mb-2">Legal</p>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-500 text-sm">Effective date: June 12, 2026 · Last updated: June 12, 2026</p>
        </div>

        <p className="text-gray-600 leading-relaxed mb-10">
          Please read these Terms of Service (&quot;Terms&quot;) carefully before using the SocialHub
          platform operated by SocialHub (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing or using
          SocialHub you agree to be bound by these Terms. If you do not agree, do not use the service.
        </p>

        <Section title="1. Acceptance of Terms">
          <p>
            By creating an account or using SocialHub in any way, you confirm that you are at least
            16 years old, have read and understood these Terms, and have the legal authority to
            enter into this agreement on behalf of yourself or the organisation you represent.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            SocialHub is a social media management platform that allows users to connect social media
            accounts, schedule and publish content, monitor analytics, and manage audience engagement
            from a single dashboard. The service is provided on a subscription basis.
          </p>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of the service at any
            time with reasonable notice.
          </p>
        </Section>

        <Section title="3. Account Registration &amp; Security">
          <p>You agree to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide accurate and complete information when creating your account</li>
            <li>Keep your password secure and not share it with others</li>
            <li>Notify us immediately if you suspect unauthorised access to your account</li>
            <li>Be responsible for all activity that occurs under your account</li>
          </ul>
          <p>We reserve the right to suspend accounts that we believe have been compromised or are being misused.</p>
        </Section>

        <Section title="4. Acceptable Use">
          <p>You agree NOT to use SocialHub to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Publish spam, misleading content, or content that violates the terms of any connected social media platform</li>
            <li>Harass, abuse, threaten, or intimidate any person</li>
            <li>Upload malware, viruses, or any malicious code</li>
            <li>Attempt to reverse-engineer, scrape, or exploit the service</li>
            <li>Violate any applicable law or regulation</li>
            <li>Infringe the intellectual property rights of others</li>
            <li>Use the service for any purpose that is illegal, harmful, or fraudulent</li>
          </ul>
          <p>Violation of this section may result in immediate account termination.</p>
        </Section>

        <Section title="5. Connected Social Media Accounts">
          <p>
            SocialHub acts as your agent to publish content to social media platforms (Meta, TikTok,
            Twitter/X, LinkedIn, Google, Bluesky) on your behalf. You remain responsible for:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>All content published through SocialHub</li>
            <li>Compliance with each platform&apos;s own terms of service and community guidelines</li>
            <li>Ensuring you have the right to publish any content, including media and copyrighted material</li>
            <li>Keeping your social media accounts in good standing</li>
          </ul>
          <p>
            We cannot guarantee uninterrupted publishing if a connected platform changes its API,
            revokes permissions, or suspends your account on that platform.
          </p>
        </Section>

        <Section title="6. Content &amp; Intellectual Property">
          <p>
            <strong>Your content.</strong> You retain all ownership rights to the content you create
            and publish through SocialHub. By uploading content, you grant SocialHub a limited,
            non-exclusive licence to store and transmit that content solely for the purpose of
            delivering the service.
          </p>
          <p>
            <strong>Our content.</strong> The SocialHub platform, including its design, code, logos,
            and documentation, is the intellectual property of SocialHub and is protected by
            copyright and trademark law. You may not copy, modify, or distribute our platform
            without written permission.
          </p>
        </Section>

        <Section title="7. Subscription &amp; Payment">
          <p>
            Some features of SocialHub require a paid subscription. Subscription fees are billed
            in advance on a monthly or annual basis. All fees are non-refundable except where
            required by applicable law.
          </p>
          <p>
            We reserve the right to change our pricing at any time. We will provide at least 30
            days&apos; notice before any price increase takes effect. Your continued use of the paid
            service after the effective date constitutes acceptance of the new pricing.
          </p>
          <p>
            If you cancel your subscription, you will retain access until the end of the current
            billing period. We do not pro-rate partial months.
          </p>
        </Section>

        <Section title="8. Disclaimer of Warranties">
          <p>
            SocialHub is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
            either express or implied, including but not limited to implied warranties of
            merchantability, fitness for a particular purpose, or non-infringement.
          </p>
          <p>
            We do not warrant that the service will be uninterrupted, error-free, or completely
            secure, or that results obtained from the service will be accurate or reliable.
          </p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, SocialHub and its officers,
            directors, employees, and agents shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, including loss of profits, data, or
            goodwill, arising out of or in connection with your use of the service.
          </p>
          <p>
            Our total liability to you for any claim arising out of or relating to these Terms
            shall not exceed the amount you paid us in the 12 months preceding the claim.
          </p>
        </Section>

        <Section title="10. Indemnification">
          <p>
            You agree to indemnify and hold SocialHub harmless from any claims, damages, losses,
            liabilities, costs, and expenses (including legal fees) arising out of or related to
            your use of the service, your content, or your violation of these Terms.
          </p>
        </Section>

        <Section title="11. Termination">
          <p>
            You may delete your account at any time from Settings. We may suspend or terminate
            your account immediately if you violate these Terms or if we reasonably believe your
            use poses a risk to the service or other users.
          </p>
          <p>
            Upon termination, your right to use SocialHub ceases immediately. Provisions of these
            Terms that by their nature should survive termination (including intellectual property,
            limitation of liability, and dispute resolution) will survive.
          </p>
        </Section>

        <Section title="12. Governing Law &amp; Disputes">
          <p>
            These Terms are governed by and construed in accordance with applicable law. Any dispute
            arising out of or relating to these Terms shall be resolved by binding arbitration or
            in the courts of competent jurisdiction, and you consent to personal jurisdiction in
            those courts.
          </p>
        </Section>

        <Section title="13. Changes to These Terms">
          <p>
            We may update these Terms from time to time. We will notify you of material changes by
            email or by a notice on the service at least 14 days before they take effect. Your
            continued use of SocialHub after the effective date constitutes acceptance of the
            revised Terms.
          </p>
        </Section>

        <Section title="14. Contact Us">
          <p>Questions about these Terms? Contact us:</p>
          <div className="bg-gray-50 rounded-xl p-5 mt-2 text-sm">
            <p className="font-semibold text-gray-800">SocialHub Legal</p>
            <p>Email: <a href="mailto:legal@socialhub.io" className="text-blue-600 hover:underline">legal@socialhub.io</a></p>
          </div>
        </Section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© 2026 SocialHub. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-blue-600 font-medium">Terms of Service</Link>
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
