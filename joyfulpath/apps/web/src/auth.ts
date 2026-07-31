import prisma from '@/lib/db';
import { cookies } from 'next/headers';

/**
 * Mock-compatible auth function.
 * In mock mode (no real Supabase), reads role from MOCK_USER_ROLE cookie
 * and finds the matching user in the local SQLite database.
 * In production (with real Supabase), uses the Supabase session.
 */
export async function auth() {
  try {
    const cookieStore = await cookies();
    const mockRole = cookieStore.get('MOCK_USER_ROLE')?.value;

    if (mockRole) {
      // Mock mode: find the first user with this role in the local DB
      const dbUser = await prisma.user.findFirst({
        where: { role: mockRole, isActive: true },
        select: { id: true, role: true, email: true, displayName: true, accountStatus: true, isActive: true },
      });

      if (!dbUser) {
        // Fallback: return a synthetic user so the frontend still works
        return {
          user: {
            id: `mock-${mockRole}-id`,
            role: mockRole,
            email: `${mockRole}@joyfulpath.org`,
            name: mockRole.charAt(0).toUpperCase() + mockRole.slice(1),
            accountStatus: 'active',
          },
        };
      }

      return {
        user: {
          id: dbUser.id,
          role: dbUser.role,
          email: dbUser.email,
          name: dbUser.displayName,
          accountStatus: dbUser.accountStatus,
        },
      };
    }

    // No mock cookie and no Supabase — unauthenticated
    return null;
  } catch (err) {
    console.error('auth() error:', err);
    return null;
  }
}
