import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: April 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="mb-2 font-medium text-gray-900">1. Data we collect</h2>
          <p>
            We collect the email address you use to sign up, the profile
            information you enter (display name, bio, avatar, links), and
            anonymous usage data (page views and link clicks) when you consent
            to analytics. We do not sell your data.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-gray-900">2. How we use it</h2>
          <p>
            Your data is used to operate the service: authenticating your
            account, displaying your public page, and showing you analytics in
            the dashboard. We may use your email address to send service
            updates. We use it for nothing else.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-gray-900">
            3. Third-party services
          </h2>
          <p>
            We use Supabase for authentication and file storage, and Vercel for
            hosting. These providers process data on our behalf under their own
            privacy policies.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-gray-900">4. Cookies</h2>
          <p>We set two types of cookies:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <span className="font-medium">Session cookie</span> — keeps you
              logged in. Set when you sign in and cleared when you sign out.
              Required for the service to function.
            </li>
            <li>
              <span className="font-medium">Analytics consent cookie</span> (
              <span className="font-mono text-xs">lto_consent</span>) — records
              your accept/reject choice for anonymous analytics (page views and
              link clicks). Lasts 12 months. No analytics data is collected
              until you accept. You can change your choice by clearing your
              cookies.
            </li>
          </ul>
          <p className="mt-2">
            No advertising or third-party tracking cookies are set.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-gray-900">5. Your rights</h2>
          <p>
            You can delete your account at any time from account settings. This
            permanently removes your profile, links, and all associated
            analytics data. You may also request a copy of your data by emailing
            us.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-gray-900">6. Contact</h2>
          <p>
            Privacy questions:{' '}
            <a
              href="mailto:hi@lookthis.one"
              className="underline hover:text-gray-900"
            >
              hi@lookthis.one
            </a>
            .
          </p>
        </section>
      </div>

      <Link
        href="/"
        className="mt-12 inline-block text-sm text-gray-500 hover:text-gray-900"
      >
        <span aria-hidden="true">←</span> Back to home
      </Link>
    </main>
  );
}
