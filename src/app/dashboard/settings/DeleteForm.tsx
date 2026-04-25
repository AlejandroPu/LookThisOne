'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { deleteAccount, type SettingsActionState } from './actions';

export function DeleteForm({ username }: { username: string }) {
  const t = useTranslations('Settings');
  const [state, formAction, pending] = useActionState(
    deleteAccount,
    null as SettingsActionState,
  );

  return (
    <section className="mt-8 space-y-4 rounded border border-red-200 p-6">
      <h2 className="text-sm font-medium text-red-600">
        {t('delete.heading')}
      </h2>
      <p className="text-sm text-gray-600">{t('delete.description')}</p>

      <form action={formAction} className="space-y-4">
        {state?.error && (
          <p role="alert" className="text-xs text-red-600">
            {state.error}
          </p>
        )}

        <div>
          <label
            htmlFor="settings-confirm-username"
            className="mb-1 block text-xs font-medium text-gray-500"
          >
            {t('delete.confirmLabelBefore')}{' '}
            <span className="font-mono font-semibold text-gray-800">
              {username}
            </span>{' '}
            {t('delete.confirmLabelAfter')}
          </label>
          <input
            id="settings-confirm-username"
            type="text"
            name="confirmation"
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {pending ? t('delete.deleting') : t('delete.submit')}
        </button>
      </form>
    </section>
  );
}
