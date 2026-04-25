'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { changePassword, type SettingsActionState } from './actions';

export function PasswordForm() {
  const t = useTranslations('Settings');
  const [state, formAction, pending] = useActionState(
    changePassword,
    null as SettingsActionState,
  );

  return (
    <section className="mt-8 space-y-4 rounded border border-gray-200 p-6">
      <h2 className="text-sm font-medium text-gray-500">
        {t('password.heading')}
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
            htmlFor="settings-password"
            className="mb-1 block text-xs font-medium text-gray-500"
          >
            {t('password.newPasswordLabel')}
          </label>
          <input
            id="settings-password"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder={t('password.minCharsPlaceholder')}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="settings-confirm"
            className="mb-1 block text-xs font-medium text-gray-500"
          >
            {t('password.confirmLabel')}
          </label>
          <input
            id="settings-confirm"
            type="password"
            name="confirm"
            autoComplete="new-password"
            placeholder={t('password.repeatPlaceholder')}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {pending ? t('password.saving') : t('password.submit')}
        </button>
      </form>
    </section>
  );
}
