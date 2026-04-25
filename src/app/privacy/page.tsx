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
            information you enter (display name, bio, avatar, links), and basic
            usage data (page views, link clicks). We do not sell your data.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-gray-900">2. How we use it</h2>
          <p>
            Your data is used to operate the service (auth, displaying your
            public page, analytics you can view in the dashboard) and to
            communicate service updates with you. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-gray-900">
            3. Third-party services
          </h2>
          <p>
            We use Supabase for authentication and file storage, and Vercel for
            hosting. These providers process data on our behalf under their own
            privacy policies. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-gray-900">4. Cookies</h2>
          <p>
            We use a session cookie to keep you logged in. No tracking or
            advertising cookies are set. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-gray-900">5. Your rights</h2>
          <p>
            You can delete your account at any time from account settings. This
            removes your profile and all associated data. You may also request a
            copy of your data by emailing us. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
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
            . Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </section>
      </div>

      <Link
        href="/"
        className="mt-12 inline-block text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back to home
      </Link>
    </main>
  );
}
