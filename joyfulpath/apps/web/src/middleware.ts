import { NextResponse, type NextRequest } from 'next/server';
import { isMockMode } from './lib/supabase/mockClient';

/**
 * Role hierarchy for route-level access control.
 * This mirrors the definitions in lib/rbac.ts but runs in Edge middleware
 * (no Prisma access), so we use simple string checks.
 */

// Roles that can access /admin/* dashboard pages
const ADMIN_DASHBOARD_ROLES = ['priest', 'admin', 'instructor'];

// Admin pages blocked for instructors (user management, system settings, etc.)
const INSTRUCTOR_BLOCKED_ADMIN_PATHS = [
  '/admin/users',
  '/admin/settings',
  '/admin/approvals',
  '/admin/permissions',
  '/admin/files',
];

// Priest-only admin pages (system-level management)
const PRIEST_ONLY_ADMIN_PATHS = [
  '/admin/settings',
  '/admin/permissions',
];

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  let user: any = null;

  // Always check for a real token first, even in mock mode,
  // since the new login API route sets ACCESS_TOKEN.
  const token = request.cookies.get('ACCESS_TOKEN')?.value;
  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadStr = atob(parts[1]);
        user = JSON.parse(payloadStr);
      }
    } catch (e) {
      console.warn('Failed to parse JWT in middleware', e);
    }
  }

  // Fallback to MOCK_USER_ROLE if no real token and in mock mode
  if (!user && isMockMode()) {
    const mockRole = request.cookies.get('MOCK_USER_ROLE')?.value;
    if (mockRole) {
      user = {
        id: `mock-${mockRole}-id`,
        email: `${mockRole}@joyfulpath.org`,
        role: mockRole,
        forcePasswordChange: false,
      };
    }
  }

  const pathname = request.nextUrl.pathname;
  const isAuth = !!user;
  const userRole = user?.role || 'student';

  // ─── 1. Redirect logged-in users away from /login or / ─────────────────────
  if (isAuth && (pathname === '/login' || pathname === '/')) {
    const redirectPath = getRoleDashboard(userRole);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // ─── 2. Redirect legacy /instructor/* routes to /admin/* ───────────────────
  if (pathname.startsWith('/instructor')) {
    const newPath = pathname.replace('/instructor', '/admin');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // ─── 3. Protect dashboard route segments ───────────────────────────────────
  const isAdminRoute = pathname.startsWith('/admin');
  const isStudentRoute = pathname.startsWith('/student');
  const isParentRoute = pathname.startsWith('/parent');

  if (isAdminRoute || isStudentRoute || isParentRoute) {
    // Must be authenticated
    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // ── /admin/* access ──
    if (isAdminRoute) {
      // Only priest, admin, and instructor can access /admin/*
      if (!ADMIN_DASHBOARD_ROLES.includes(userRole)) {
        return NextResponse.redirect(new URL(getRoleDashboard(userRole), request.url));
      }

      // Instructor restrictions within /admin/*
      if (userRole === 'instructor') {
        if (INSTRUCTOR_BLOCKED_ADMIN_PATHS.some(p => pathname.startsWith(p))) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
      }

      // Admin restrictions (priest-only pages)
      if (userRole === 'admin') {
        if (PRIEST_ONLY_ADMIN_PATHS.some(p => pathname.startsWith(p))) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
      }
    }

    // ── /parent/* access ── only parents (and priest/admin for impersonation)
    if (isParentRoute && userRole !== 'parent' && userRole !== 'admin' && userRole !== 'priest') {
      return NextResponse.redirect(new URL(getRoleDashboard(userRole), request.url));
    }

    // ── /student/* access ── students + admin-level users for observation
    if (isStudentRoute && userRole !== 'student' && userRole !== 'admin' && userRole !== 'priest' && userRole !== 'instructor') {
      return NextResponse.redirect(new URL(getRoleDashboard(userRole), request.url));
    }
  }

  return response;
}

/**
 * Returns the default dashboard path for a given role.
 */
function getRoleDashboard(role: string): string {
  switch (role) {
    case 'priest':
    case 'admin':
    case 'instructor':
      return '/admin/dashboard';
    case 'parent':
      return '/parent/dashboard';
    case 'student':
    default:
      return '/student/dashboard';
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
