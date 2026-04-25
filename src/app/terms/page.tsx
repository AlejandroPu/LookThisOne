import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: April 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="mb-2 font-medium text-gray-900">1. Acceptance</h2>
          <p>
            By creating an account or using LookThisOne you agree to these
            terms. If you do not agree, do not use the service. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-gray-900">2. Beta notice</h2>
          <p>
            LookThisOne is currently in beta. The service is provided as-is.
            Account data may be reset before the general release. We will
            provide advance notice where possible. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-gray-900">3. Your content</h2>
          <p>
            You retain ownership of the content you publish. By publishing it
            you grant us a licence to display it on the platform. You are
            responsible for ensuring your content does not infringe third-party
            rights or applicable law. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-gray-900">4. Prohibited use</h2>
          <p>
            You may not use LookThisOne to distribute spam, malware, or content
            that is illegal in your jurisdiction. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-gray-900">
            5. Limitation of liability
          </h2>
          <p>
            To the maximum extent permitted by law, LookThisOne is not liable
            for indirect, incidental, or consequential damages arising from your
            use of the service. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-gray-900">6. Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the
            service after changes are posted constitutes acceptance. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-gray-900">7. Contact</h2>
          <p>
            Questions? Reach us at{' '}
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
