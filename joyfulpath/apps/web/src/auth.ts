import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function auth() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Fetch the role and details from the Prisma database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, role: true, email: true, displayName: true, accountStatus: true, isActive: true }
    });

    if (!dbUser || !dbUser.isActive) return null;

    if (dbUser.accountStatus === 'pending') {
      // Create login history record (failed)
      try {
        await prisma.loginHistory.create({
          data: {
            userId: dbUser.id,
            success: false,
            userAgent: 'system', // Ideally we get headers from Next.js, but auth is often server-side contextless here
          }
        });
      } catch (e) {
        console.error('Failed to log login history', e);
      }
      return null;
    }

    if (dbUser.accountStatus === 'suspended') {
      return null;
    }

    // Create login history record (success)
    try {
      await prisma.loginHistory.create({
        data: {
          userId: dbUser.id,
          success: true,
          userAgent: 'system',
        }
      });
    } catch (e) {
      console.error('Failed to log login history', e);
    }

    return {
      user: {
        id: dbUser.id,
        role: dbUser.role,
        email: dbUser.email,
        name: dbUser.displayName,
        accountStatus: dbUser.accountStatus
      }
    };
  } catch (err) {
    console.error('auth() error:', err);
    return null;
  }
}
