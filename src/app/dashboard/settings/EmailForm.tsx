'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { changeEmail, type SettingsActionState } from './actions';

export function EmailForm({ currentEmail }: { currentEmail: string }) {
  const t = useTranslations('Settings');
  const [state, formAction, pending] = useActionState(
    changeEmail,
    null as SettingsActionState,
  );

  return (
    <section className="mt-8 space-y-4 rounded border border-gray-200 p-6">
      <h2 className="text-sm font-medium text-gray-500">
        {t('email.heading')}
      </h2>

      <form action={formAction} className="space-y-4">
        {state?.error && (
          <p role="alert" className="text-xs text-red-600">
            {state.error}
          </p>
        )}
        {state?.success && (
          <p role="status" className="text-xs text-green-600">
            {state.success}
          </p>
        )}

        <div>
          <label
            htmlFor="settings-email"
            className="mb-1 block text-xs font-medium text-gray-500"
          >
            {t('email.newEmailLabel')}
          </label>
          <input
            id="settings-email"
            type="email"
            name="email"
            placeholder={currentEmail}
            autoComplete="email"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {pending ? t('email.sending') : t('email.submit')}
        </button>
      </form>
    </section>
  );
}
