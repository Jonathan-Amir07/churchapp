import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isMockMode, createMockSupabase } from './lib/supabase/mockClient';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  let supabase: any;
  let user: any = null;

  if (isMockMode()) {
    const mockRole = request.cookies.get('MOCK_USER_ROLE')?.value;
    supabase = createMockSupabase(mockRole);
    if (mockRole) {
      user = {
        id: `mock-${mockRole}-id`,
        email: `${mockRole}@joyfulpath.org`,
        app_metadata: { role: mockRole },
        user_metadata: { role: mockRole },
      };
    }
  } else {
    supabase = createServerClient(
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

    try {
      const { data } = await supabase.auth.getUser();
      user = data?.user || null;
    } catch (e) {
      console.warn('Supabase auth error in middleware:', e);
    }
  }



  const pathname = request.nextUrl.pathname;
  const isAuth = !!user;
  const userRole = user?.app_metadata?.role || user?.user_metadata?.role || 'student';

  // 1. Redirect logged-in users away from /login or /
  if (isAuth && (pathname === '/login' || pathname === '/')) {
    const redirectPath =
      (userRole === 'admin' || userRole === 'instructor')
        ? `/admin/dashboard`
        : userRole === 'parent'
        ? `/parent/dashboard`
        : `/student/dashboard`;

    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // 2. Redirect legacy /instructor/* routes to /admin/*
  if (pathname.startsWith('/instructor')) {
    const newPath = pathname.replace('/instructor', '/admin');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // 3. Protect routes
  const isAdminRoute = pathname.startsWith('/admin');
  const isStudentRoute = pathname.startsWith('/student');
  const isParentRoute = pathname.startsWith('/parent');

  if (isAdminRoute || isStudentRoute || isParentRoute) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role-specific dashboard fallback helper
    const roleDashboard = () =>
      (userRole === 'admin' || userRole === 'instructor') ? '/admin/dashboard'
      : userRole === 'parent' ? '/parent/dashboard'
      : '/student/dashboard';

    // Admin route — admins and instructors allowed
    if (isAdminRoute && userRole !== 'admin' && userRole !== 'instructor') {
      return NextResponse.redirect(new URL(roleDashboard(), request.url));
    }

    // Instructor specific protections
    if (isAdminRoute && userRole === 'instructor') {
      const blockedInstructorPaths = ['/admin/users', '/admin/settings', '/admin/approvals', '/admin/permissions', '/admin/files'];
      if (blockedInstructorPaths.some(p => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }

    // Parent route — only parents allowed
    if (isParentRoute && userRole !== 'parent') {
      return NextResponse.redirect(new URL(roleDashboard(), request.url));
    }

    // Student route — students & admins allowed
    if (isStudentRoute && userRole !== 'student' && userRole !== 'admin' && userRole !== 'instructor') {
      return NextResponse.redirect(new URL(roleDashboard(), request.url));
    }
  }

  return response;
}


export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
