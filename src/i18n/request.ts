import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get('lto_locale')?.value;
    locale =
      cookieLocale &&
      (routing.locales as readonly string[]).includes(cookieLocale)
        ? cookieLocale
        : routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
