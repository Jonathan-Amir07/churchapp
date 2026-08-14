import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { requireAuth } from '@/lib/rbac';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const body = await req.json();
    const { password } = body;

    if (!password || password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        passwordHash,
        forcePasswordChange: false
      }
    });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Change Password Error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
