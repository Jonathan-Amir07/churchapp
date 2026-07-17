import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ar';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = (localeCookie && locales.includes(localeCookie as any)
    ? localeCookie
    : defaultLocale) as Locale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
