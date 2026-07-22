import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mockPets = [
      { id: '1', name: 'Lion of St. Mark', level: 3, xp: 450, isEquipped: true },
    ];

    return NextResponse.json({ success: true, data: mockPets });
  } catch (error) {
    console.error('Pets GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
