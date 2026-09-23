import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, setRequestLocale } from 'next-intl/server';
import { getDirection } from '@/lib/utils';
import { ToastContainer } from '@/components/ui';
import './globals.css';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-ibm-plex-sans-ar',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'نوصل ونوصل للسماء — مدارس الأحد للتعلم التفاعلي',
    template: '%s | نوصل ونوصل للسماء',
  },
  description:
    'An engaging gamified learning platform for Sunday School children. Learn Bible stories, earn XP, unlock badges, and climb the leaderboard!',
  keywords: ['Sunday School', 'Bible', 'gamified learning', 'children', 'education', 'church'],
  authors: [{ name: 'نوصل ونوصل للسماء' }],
  openGraph: {
    title: 'نوصل ونوصل للسماء — مدارس الأحد للتعلم التفاعلي',
    description: 'Learn Bible stories, earn XP, unlock badges!',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  setRequestLocale(locale);
  console.log("LAYOUT LOCALE:", locale);
  const messages = await getMessages();
  const dir = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${ibmPlexSansArabic.variable} ${ibmPlexSans.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
          precedence="default"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <ToastContainer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

