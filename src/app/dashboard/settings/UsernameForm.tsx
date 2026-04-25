'use client';

import { useState, useActionState } from 'react';

import { changeUsername, type SettingsActionState } from './actions';

export function UsernameForm({ currentUsername }: { currentUsername: string }) {
  const [state, formAction, pending] = useActionState(
    changeUsername,
    null as SettingsActionState,
  );
  const [draft, setDraft] = useState('');
  const [confirming, setConfirming] = useState(false);

  function handleRequestConfirm() {
    if (draft.trim() && draft.trim().toLowerCase() !== currentUsername) {
      setConfirming(true);
    }
  }

  function handleCancel() {
    setConfirming(false);
  }

  return (
    <section className="mt-8 space-y-4 rounded border border-gray-200 p-6">
      <h2 className="text-sm font-medium text-gray-500">Username</h2>
      <p className="text-xs text-gray-500">
        Your public URL is{' '}
        <span className="font-mono font-medium text-gray-800">
          lookthis.one/{currentUsername}
        </span>
      </p>

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

      {!confirming ? (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="settings-username"
              className="mb-1 block text-xs font-medium text-gray-500"
            >
              New username
            </label>
            <input
              id="settings-username"
              type="text"
              name="username"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={handleRequestConfirm}
            disabled={
              !draft.trim() || draft.trim().toLowerCase() === currentUsername
            }
            className="rounded bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            Change username
          </button>
        </div>
      ) : (
        <form action={formAction} className="space-y-3">
          <input
            type="hidden"
            name="username"
            value={draft.trim().toLowerCase()}
          />
          <p className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            ⚠️ Your public URL will change from{' '}
            <span className="font-mono font-semibold">
              lookthis.one/{currentUsername}
            </span>{' '}
            to{' '}
            <span className="font-mono font-semibold">
              lookthis.one/{draft.trim().toLowerCase()}
            </span>
            . All existing links pointing to your current URL will break.
          </p>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={pending}
              className="rounded bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {pending ? 'Saving…' : 'Confirm change'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={pending}
              className="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
