'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { readConsent, setConsent } from '@/lib/consent/cookie.client';

const PRIVATE_PREFIXES = [
  '/dashboard',
  '/login',
  '/signup',
  '/auth',
  '/onboarding',
  '/go',
];

export function ConsentBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(() => {
    if (typeof document === 'undefined') return false;
    return readConsent() === null;
  });

  if (PRIVATE_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  if (!visible) return null;

  function handleChoice(value: 'granted' | 'denied') {
    setConsent(value);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white shadow-md"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">
          We use cookies to measure anonymous page views. You can accept or
          reject — your choice is remembered for 12 months.{' '}
          <Link href="/privacy" className="underline hover:text-gray-900">
            Privacy policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => handleChoice('denied')}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reject
          </button>
          <button
            onClick={() => handleChoice('granted')}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
