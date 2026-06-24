import type { Metadata } from 'next';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { SessionProvider } from 'next-auth/react';
import { getDirection } from '@/lib/utils';
import { ToastContainer } from '@/components/ui';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-arabic',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'JoyfulPath — Sunday School Gamified Learning',
    template: '%s | JoyfulPath',
  },
  description:
    'An engaging gamified learning platform for Sunday School children. Learn Bible stories, earn XP, unlock badges, and climb the leaderboard!',
  keywords: ['Sunday School', 'Bible', 'gamified learning', 'children', 'education', 'church'],
  authors: [{ name: 'JoyfulPath' }],
  openGraph: {
    title: 'JoyfulPath — Sunday School Gamified Learning',
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
  const messages = await getMessages();
  const dir = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${notoSansArabic.variable} h-full`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
            <ToastContainer />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
