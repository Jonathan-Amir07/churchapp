import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import enMessages from '../../messages/en.json';
import arMessages from '../../messages/ar.json';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ar';

const messagesMap: Record<Locale, any> = {
  en: enMessages,
  ar: arMessages,
};

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = (localeCookie && locales.includes(localeCookie as any)
    ? localeCookie
    : defaultLocale) as Locale;

  let messages = messagesMap[locale];

  return {
    locale,
    messages,
  };
});
