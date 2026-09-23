import { cookies } from 'next/headers';

/**
 * Validates the JWT cookie to establish a server-side session.
 */
export async function auth() {
  try {
    const cookieStore = await cookies();
    
    // First try the real token (JWT)
    const token = cookieStore.get('ACCESS_TOKEN')?.value;
    if (token) {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadStr = atob(parts[1]);
        const parsed = JSON.parse(payloadStr);
        return {
          user: {
            id: parsed.sub,
            role: parsed.role,
            email: parsed.email,
            name: parsed.username,
            accountStatus: parsed.accountStatus || 'active',
            isProfileComplete: parsed.isProfileComplete || false,
          }
        };
      }
    }

    // No token — unauthenticated
    return null;
  } catch (err) {
    console.error('auth() error:', err);
    return null;
  }
}
