'use client';

import { useEffect, useRef } from 'react';

import { recordView } from './analytics';

export function ViewTracker({ pageId }: { pageId: string }) {
  // Ref guard prevents a duplicate insert under React Strict Mode, which
  // double-invokes effects in dev. SPA navigation to a different profile
  // mounts a new component, so the ref resets and the new visit counts —
  // which is the desired behaviour.
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    recordView(pageId);
  }, [pageId]);

  return null;
}
