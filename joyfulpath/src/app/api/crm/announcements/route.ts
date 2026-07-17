import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== 'instructor' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetAudience, message, title } = await req.json();

    if (!message || !title) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // Broadcast logic here
    return NextResponse.json({ success: true, message: 'Announcement broadcasted successfully' });
  } catch (error) {
    console.error('Announcements POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
