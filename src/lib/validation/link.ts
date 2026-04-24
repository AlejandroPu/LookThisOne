export type LinkValidationError =
  | 'title_empty'
  | 'title_too_long'
  | 'url_empty'
  | 'url_invalid';

export type LinkValidationResult =
  | { ok: true; value: { title: string; url: string } }
  | { ok: false; error: LinkValidationError };

const TITLE_MAX = 100;

export function validateLink(raw: {
  title: unknown;
  url: unknown;
}): LinkValidationResult {
  const title = String(raw.title ?? '').trim();
  const url = String(raw.url ?? '').trim();

  if (!title) return { ok: false, error: 'title_empty' };
  if (title.length > TITLE_MAX) return { ok: false, error: 'title_too_long' };
  if (!url) return { ok: false, error: 'url_empty' };

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { ok: false, error: 'url_invalid' };
    }
  } catch {
    return { ok: false, error: 'url_invalid' };
  }

  return { ok: true, value: { title, url } };
}

export const LINK_ERROR_MESSAGES: Record<LinkValidationError, string> = {
  title_empty: 'Title is required.',
  title_too_long: `Title must be ${TITLE_MAX} characters or fewer.`,
  url_empty: 'URL is required.',
  url_invalid: 'Enter a valid URL starting with http:// or https://',
};
