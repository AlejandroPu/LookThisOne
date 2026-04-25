'use client';

import { useEffect } from 'react';

import { recordView } from './analytics';

export function ViewTracker({ pageId }: { pageId: string }) {
  useEffect(() => {
    recordView(pageId);
  }, [pageId]);

  return null;
}
