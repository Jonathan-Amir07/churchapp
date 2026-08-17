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

    const { searchParams } = new URL(req.url);
    const childId = searchParams.get('child');

    if (!childId) {
      return NextResponse.json({ error: 'Missing child parameter' }, { status: 400 });
    }

    // Verify this parent has this child
    const family = await prisma.family.findFirst({
      where: {
        OR: [
          { fatherId: user.id },
          { motherId: user.id }
        ],
        children: {
          some: {
            id: childId
          }
        }
      }
    });

    if (!family) {
      return NextResponse.json({ error: 'Not authorized for this child' }, { status: 403 });
    }

    // Fetch the child profile
    const childProfile = await prisma.user.findUnique({
      where: { id: childId },
      select: { displayName: true }
    });

    // Fetch attendance records
    const records = await prisma.attendance.findMany({
      where: { userId: childId },
      orderBy: { date: 'desc' }
    });

    const formattedRecords = records.map((r: any) => ({
      id: r.id,
      date: r.date.toISOString().split('T')[0],
      status: r.status,
      notes: r.notes
    }));

    return NextResponse.json({ profile: childProfile, attendance: formattedRecords });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
