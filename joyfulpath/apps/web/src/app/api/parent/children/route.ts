import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;

    if (user.role !== 'parent') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Find the family where this user is either father or mother
    const family = await prisma.family.findFirst({
      where: {
        OR: [
          { fatherId: user.id },
          { motherId: user.id }
        ]
      },
      include: {
        children: {
          select: {
            id: true,
            displayName: true,
            totalXp: true,
            totalPoints: true,
            currentStreak: true,
            avatarUrl: true,
            role: true
          }
        }
      }
    });

    if (!family || !family.children) {
      return NextResponse.json([]);
    }

    // Map Prisma models to the expected keys in the frontend (snake_case if needed, but let's use what the frontend uses: total_xp, etc.)
    const formattedChildren = family.children.map((c: any) => ({
      id: c.id,
      display_name: c.displayName,
      total_xp: c.totalXp,
      total_points: c.totalPoints,
      current_streak: c.currentStreak,
      avatar_url: c.avatarUrl,
      role: c.role
    }));

    return NextResponse.json(formattedChildren);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
