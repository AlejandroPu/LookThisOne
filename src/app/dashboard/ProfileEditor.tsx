'use client';

import { useActionState, useEffect, useRef, useState } from 'react';

import { updateProfile, type ProfileActionState } from './actions';

type ProfileEditorProps = {
  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
  username: string;
};

export function ProfileEditor({
  title,
  bio,
  avatarUrl,
  username,
}: ProfileEditorProps) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    null as ProfileActionState,
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== avatarUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, avatarUrl]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl && previewUrl !== avatarUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  }

  const initial = (title ?? username).charAt(0).toUpperCase();

  return (
    <section className="mt-8 space-y-6 rounded border border-gray-200 p-6">
      <h2 className="text-sm font-medium text-gray-500">Profile</h2>

      <form action={formAction} className="space-y-5">
        {state?.error ? (
          <p role="alert" className="text-xs text-red-600">
            {state.error}
          </p>
        ) : state?.success ? (
          <p role="status" className="text-xs text-green-600">
            Profile saved.
          </p>
        ) : null}

        {/* Avatar */}
        <div className="flex items-center gap-4">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Avatar preview"
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold text-gray-600">
              {initial}
            </div>
          )}
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
            >
              Change photo
            </button>
            <p className="mt-1 text-xs text-gray-400">
              JPG, PNG or WebP · max 2 MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            name="avatar"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Display name */}
        <div>
          <label
            htmlFor="profile-title"
            className="mb-1 block text-xs font-medium text-gray-500"
          >
            Display name
          </label>
          <input
            id="profile-title"
            type="text"
            name="title"
            defaultValue={title ?? ''}
            maxLength={100}
            placeholder={`@${username}`}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {/* Bio */}
        <div>
          <label
            htmlFor="profile-bio"
            className="mb-1 block text-xs font-medium text-gray-500"
          >
            Bio
          </label>
          <textarea
            id="profile-bio"
            name="bio"
            defaultValue={bio ?? ''}
            maxLength={300}
            rows={3}
            placeholder="A short description about you…"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </section>
  );
}
