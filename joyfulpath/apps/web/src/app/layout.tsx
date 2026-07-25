import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { getDirection } from '@/lib/utils';
import { ToastContainer } from '@/components/ui';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans-en',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-sans-ar',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'نوصل و نوصل للسماء — مدارس الأحد للتعلم التفاعلي',
    template: '%s | نوصل و نوصل للسماء',
  },
  description:
    'An engaging gamified learning platform for Sunday School children. Learn Bible stories, earn XP, unlock badges, and climb the leaderboard!',
  keywords: ['Sunday School', 'Bible', 'gamified learning', 'children', 'education', 'church'],
  authors: [{ name: 'JoyfulPath' }],
  openGraph: {
    title: 'نوصل و نوصل للسماء — مدارس الأحد للتعلم التفاعلي',
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
      className={`${cairo.variable} ${inter.variable} h-full`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
          <ToastContainer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

