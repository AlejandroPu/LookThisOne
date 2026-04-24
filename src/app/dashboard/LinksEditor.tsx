'use client';

import {
  useActionState,
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from 'react';
import type { Link } from '@prisma/client';

import {
  createLink,
  deleteLink,
  toggleLinkEnabled,
  updateLink,
  type LinkActionState,
} from './actions';

// --- Types ---

type OptimisticAction =
  | { type: 'toggle'; id: string }
  | { type: 'delete'; id: string };

function optimisticReducer(links: Link[], action: OptimisticAction): Link[] {
  if (action.type === 'toggle') {
    return links.map((l) =>
      l.id === action.id ? { ...l, enabled: !l.enabled } : l,
    );
  }
  if (action.type === 'delete') {
    return links.filter((l) => l.id !== action.id);
  }
  return links;
}

// --- Sub-components ---

function LinkEditForm({ link, onDone }: { link: Link; onDone: () => void }) {
  const updateWithId = updateLink.bind(null, link.id);
  const [state, formAction, pending] = useActionState(updateWithId, null);

  useEffect(() => {
    if (state !== null && !state.error) onDone();
  }, [state, onDone]);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      {state?.error ? (
        <p role="alert" className="text-xs text-red-600">
          {state.error}
        </p>
      ) : null}
      <input
        type="text"
        name="title"
        defaultValue={link.title}
        required
        maxLength={100}
        placeholder="Title"
        className="rounded border border-gray-300 px-2 py-1 text-sm"
      />
      <input
        type="url"
        name="url"
        defaultValue={link.url}
        required
        placeholder="https://"
        className="rounded border border-gray-300 px-2 py-1 font-mono text-sm"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-3 py-1 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function LinkRow({
  link,
  onEdit,
  onToggle,
  onDelete,
}: {
  link: Link;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        onClick={onToggle}
        aria-label={link.enabled ? 'Disable link' : 'Enable link'}
        className={`mt-0.5 h-4 w-4 shrink-0 rounded border ${
          link.enabled ? 'border-black bg-black' : 'border-gray-300 bg-white'
        }`}
      />
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${link.enabled ? '' : 'text-gray-400 line-through'}`}
        >
          {link.title}
        </p>
        <p className="truncate font-mono text-xs text-gray-500">{link.url}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-gray-500 hover:text-black"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-xs text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// --- Main component ---

export function LinksEditor({ links: initialLinks }: { links: Link[] }) {
  const [optimisticLinks, dispatchOptimistic] = useOptimistic(
    initialLinks,
    optimisticReducer,
  );
  const [, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);

  const [createState, createAction, createPending] = useActionState(
    createLink,
    null as LinkActionState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (createState !== null && !createState.error) {
      formRef.current?.reset();
    }
  }, [createState]);

  function handleToggle(id: string) {
    dispatchOptimistic({ type: 'toggle', id });
    startTransition(async () => {
      await toggleLinkEnabled(id);
    });
  }

  function handleDelete(id: string) {
    dispatchOptimistic({ type: 'delete', id });
    startTransition(async () => {
      await deleteLink(id);
    });
  }

  return (
    <section className="mt-8 space-y-6 rounded border border-gray-200 p-6">
      <h2 className="text-sm font-medium text-gray-500">Links</h2>

      {optimisticLinks.length === 0 ? (
        <p className="text-sm text-gray-400">No links yet. Add one below.</p>
      ) : (
        <ul className="space-y-4">
          {optimisticLinks.map((link) => (
            <li key={link.id}>
              {editingId === link.id ? (
                <LinkEditForm link={link} onDone={() => setEditingId(null)} />
              ) : (
                <LinkRow
                  link={link}
                  onEdit={() => setEditingId(link.id)}
                  onToggle={() => handleToggle(link.id)}
                  onDelete={() => handleDelete(link.id)}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-gray-100 pt-4">
        <p className="mb-3 text-xs font-medium text-gray-500">Add a link</p>
        <form
          ref={formRef}
          action={createAction}
          className="flex flex-col gap-2"
        >
          {createState?.error ? (
            <p role="alert" className="text-xs text-red-600">
              {createState.error}
            </p>
          ) : null}
          <input
            type="text"
            name="title"
            required
            maxLength={100}
            placeholder="Title (e.g. My Portfolio)"
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="url"
            name="url"
            required
            placeholder="https://"
            className="rounded border border-gray-300 px-3 py-2 font-mono text-sm"
          />
          <button
            type="submit"
            disabled={createPending}
            className="self-start rounded bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {createPending ? 'Adding…' : 'Add link'}
          </button>
        </form>
      </div>
    </section>
  );
}
