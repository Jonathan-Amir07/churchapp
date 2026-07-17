import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== 'instructor' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock response for follow-up calls
    const mockCalls = [
      { id: '1', studentId: 'student_1', date: new Date(), notes: 'Spoke with parent about attendance.', status: 'completed' },
    ];

    return NextResponse.json({ success: true, data: mockCalls });
  } catch (error) {
    console.error('Calls API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== 'instructor' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { studentId, notes, date, status } = await req.json();

    if (!studentId || !notes) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    return NextResponse.json({ success: true, message: 'Call logged successfully' });
  } catch (error) {
    console.error('Calls POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
