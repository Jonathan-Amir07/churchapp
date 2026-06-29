import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuth = !!user;
  const userRole = user?.app_metadata?.role || user?.user_metadata?.role || 'student';

  // 1. Redirect logged-in users away from /login
  if (isAuth && (pathname === '/login' || pathname === '/')) {
    const redirectPath =
      userRole === 'admin'
        ? `/admin/dashboard`
        : userRole === 'instructor'
        ? `/instructor/dashboard`
        : `/student/dashboard`;

    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // 2. Protect routes
  const isAdminRoute = pathname.startsWith('/admin');
  const isInstructorRoute = pathname.startsWith('/instructor');
  const isStudentRoute = pathname.startsWith('/student');

  if (isAdminRoute || isInstructorRoute || isStudentRoute) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Admin role checks
    if (isAdminRoute && userRole !== 'admin') {
      const dashboardPath = userRole === 'instructor' ? '/instructor/dashboard' : '/student/dashboard';
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // Instructor role checks
    if (isInstructorRoute && userRole !== 'instructor' && userRole !== 'admin') {
      const dashboardPath = userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard';
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // Student role checks
    if (isStudentRoute && userRole !== 'student' && userRole !== 'instructor' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
