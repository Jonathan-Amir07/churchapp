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
      select: { id: true, role: true, email: true, displayName: true }
    });

    if (!dbUser) return null;

    return {
      user: {
        id: dbUser.id,
        role: dbUser.role,
        email: dbUser.email,
        name: dbUser.displayName
      }
    };
  } catch (err) {
    console.error('auth() error:', err);
    return null;
  }
}
