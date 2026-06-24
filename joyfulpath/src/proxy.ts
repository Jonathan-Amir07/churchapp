import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/request';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

const { auth } = NextAuth(authConfig);

export default auth((req: any) => {
  const pathname = req.nextUrl.pathname;
  const segments = pathname.split('/');
  const possibleLocale = segments[1];
  const hasLocale = ['en', 'ar'].includes(possibleLocale);
  const basePath = hasLocale ? '/' + segments.slice(2).join('/') : pathname;
  const locale = hasLocale ? possibleLocale : 'en';

  const isAuth = !!req.auth;
  const userRole = req.auth?.user?.role;

  // 1. If user is logged in and tries to access /login, redirect to their dashboard
  if (isAuth && (basePath === '/login' || basePath === '/')) {
    const redirectPath =
      userRole === 'admin'
        ? `/admin/dashboard`
        : userRole === 'instructor'
        ? `/instructor/dashboard`
        : `/student/dashboard`;

    const finalPath = locale === 'en' ? redirectPath : `/${locale}${redirectPath}`;
    return NextResponse.redirect(new URL(finalPath, req.url));
  }

  // 2. Protect routes
  const isAdminRoute = basePath.startsWith('/admin');
  const isInstructorRoute = basePath.startsWith('/instructor');
  const isStudentRoute = basePath.startsWith('/student');

  if (isAdminRoute || isInstructorRoute || isStudentRoute) {
    if (!isAuth) {
      const loginPath = locale === 'en' ? '/login' : `/${locale}/login`;
      return NextResponse.redirect(new URL(loginPath, req.url));
    }

    // Check role authorization
    if (isAdminRoute && userRole !== 'admin') {
      const dashboardPath = userRole === 'instructor' ? '/instructor/dashboard' : '/student/dashboard';
      const finalPath = locale === 'en' ? dashboardPath : `/${locale}${dashboardPath}`;
      return NextResponse.redirect(new URL(finalPath, req.url));
    }

    if (isInstructorRoute && userRole !== 'instructor' && userRole !== 'admin') {
      const dashboardPath = userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard';
      const finalPath = locale === 'en' ? dashboardPath : `/${locale}${dashboardPath}`;
      return NextResponse.redirect(new URL(finalPath, req.url));
    }

    if (isStudentRoute && userRole !== 'student' && userRole !== 'instructor' && userRole !== 'admin') {
      const loginPath = locale === 'en' ? '/login' : `/${locale}/login`;
      return NextResponse.redirect(new URL(loginPath, req.url));
    }
  }

  // Run intlMiddleware for normal paths
  return intlMiddleware(req);
});

export const config = {
  // Match all pathnames except for
  // - api routes
  // - _next (Next.js internals)
  // - static files (images, etc.)
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
