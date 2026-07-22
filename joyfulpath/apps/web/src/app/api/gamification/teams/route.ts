import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const mockTeams = [
      { id: '1', name: 'Angels of Light', xp: 4500, rank: 1, members: 12 },
      { id: '2', name: 'Warriors of Faith', xp: 4200, rank: 2, members: 10 },
    ];

    return NextResponse.json({ success: true, data: mockTeams });
  } catch (error) {
    console.error('Teams GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
