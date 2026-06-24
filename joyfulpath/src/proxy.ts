import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req: any) => {
  const pathname = req.nextUrl.pathname;
  const basePath = pathname;

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

    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  // 2. Protect routes
  const isAdminRoute = basePath.startsWith('/admin');
  const isInstructorRoute = basePath.startsWith('/instructor');
  const isStudentRoute = basePath.startsWith('/student');

  if (isAdminRoute || isInstructorRoute || isStudentRoute) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Check role authorization
    if (isAdminRoute && userRole !== 'admin') {
      const dashboardPath = userRole === 'instructor' ? '/instructor/dashboard' : '/student/dashboard';
      return NextResponse.redirect(new URL(dashboardPath, req.url));
    }

    if (isInstructorRoute && userRole !== 'instructor' && userRole !== 'admin') {
      const dashboardPath = userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard';
      return NextResponse.redirect(new URL(dashboardPath, req.url));
    }

    if (isStudentRoute && userRole !== 'student' && userRole !== 'instructor' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  // Match all pathnames except for
  // - api routes
  // - _next (Next.js internals)
  // - static files (images, etc.)
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
