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
import { useTranslations } from 'next-intl';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  createLink,
  deleteLink,
  reorderLinks,
  toggleLinkEnabled,
  updateLink,
  type LinkActionState,
} from './actions';

// --- Types ---

type OptimisticAction =
  | { type: 'toggle'; id: string }
  | { type: 'delete'; id: string }
  | { type: 'reorder'; orderedIds: string[] };

function optimisticReducer(links: Link[], action: OptimisticAction): Link[] {
  if (action.type === 'toggle') {
    return links.map((l) =>
      l.id === action.id ? { ...l, enabled: !l.enabled } : l,
    );
  }
  if (action.type === 'delete') {
    return links.filter((l) => l.id !== action.id);
  }
  if (action.type === 'reorder') {
    const byId = new Map(links.map((l) => [l.id, l]));
    return action.orderedIds
      .map((id) => byId.get(id))
      .filter((l): l is Link => l !== undefined);
  }
  return links;
}

// --- Sub-components ---

function LinkEditForm({ link, onDone }: { link: Link; onDone: () => void }) {
  const t = useTranslations('Links');
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
        placeholder={t('editTitlePlaceholder')}
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
          {pending ? t('saving') : t('save')}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-50"
        >
          {t('cancel')}
        </button>
      </div>
    </form>
  );
}

function LinkRow({
  link,
  dragHandle,
  onEdit,
  onToggle,
  onDelete,
}: {
  link: Link;
  dragHandle?: React.ReactNode;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations('Links');

  return (
    <div className="flex items-start gap-3">
      {dragHandle}
      <button
        type="button"
        onClick={onToggle}
        aria-label={link.enabled ? t('disableLink') : t('enableLink')}
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
          {t('edit')}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-xs text-red-500 hover:text-red-700"
        >
          {t('delete')}
        </button>
      </div>
    </div>
  );
}

function SortableLinkItem({
  link,
  isEditing,
  onEdit,
  onEditDone,
  onToggle,
  onDelete,
}: {
  link: Link;
  isEditing: boolean;
  onEdit: () => void;
  onEditDone: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations('Links');
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id, disabled: isEditing });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const dragHandle = (
    <button
      type="button"
      aria-label={t('reorderAriaLabel', { title: link.title })}
      className="mt-0.5 shrink-0 cursor-grab touch-none text-gray-400 hover:text-gray-700 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-30"
      disabled={isEditing}
      {...attributes}
      {...listeners}
    >
      {/* Grip icon (6 dots) */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="4" cy="3" r="1.2" />
        <circle cx="10" cy="3" r="1.2" />
        <circle cx="4" cy="7" r="1.2" />
        <circle cx="10" cy="7" r="1.2" />
        <circle cx="4" cy="11" r="1.2" />
        <circle cx="10" cy="11" r="1.2" />
      </svg>
    </button>
  );

  return (
    <li ref={setNodeRef} style={style}>
      {isEditing ? (
        <LinkEditForm link={link} onDone={onEditDone} />
      ) : (
        <LinkRow
          link={link}
          dragHandle={dragHandle}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      )}
    </li>
  );
}

// --- Main component ---

export function LinksEditor({ links: initialLinks }: { links: Link[] }) {
  const t = useTranslations('Links');
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

  const sensors = useSensors(
    // 6px activation distance so clicks on buttons inside the row don't
    // trigger a drag accidentally.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = optimisticLinks.findIndex((l) => l.id === active.id);
    const newIndex = optimisticLinks.findIndex((l) => l.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const orderedIds = arrayMove(optimisticLinks, oldIndex, newIndex).map(
      (l) => l.id,
    );

    // dnd-kit fires this callback via unstable_batchedUpdates (legacy React
    // batching), which does NOT count as a transition for useOptimistic.
    // Wrap explicitly so the dispatch is valid.
    startTransition(async () => {
      dispatchOptimistic({ type: 'reorder', orderedIds });
      await reorderLinks(orderedIds);
    });
  }

  return (
    <section className="mt-8 space-y-6 rounded border border-gray-200 p-6">
      <h2 className="text-sm font-medium text-gray-500">{t('heading')}</h2>

      {optimisticLinks.length === 0 ? (
        <p className="text-sm text-gray-400">{t('empty')}</p>
      ) : (
        <DndContext
          id="links-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={optimisticLinks.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-4">
              {optimisticLinks.map((link) => (
                <SortableLinkItem
                  key={link.id}
                  link={link}
                  isEditing={editingId === link.id}
                  onEdit={() => setEditingId(link.id)}
                  onEditDone={() => setEditingId(null)}
                  onToggle={() => handleToggle(link.id)}
                  onDelete={() => handleDelete(link.id)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      <div className="border-t border-gray-100 pt-4">
        <p className="mb-3 text-xs font-medium text-gray-500">
          {t('addHeading')}
        </p>
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
            placeholder={t('titlePlaceholder')}
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
            {createPending ? t('adding') : t('addLink')}
          </button>
        </form>
      </div>
    </section>
  );
}
