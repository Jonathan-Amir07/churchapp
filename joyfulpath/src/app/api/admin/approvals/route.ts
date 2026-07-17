import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pendingUsers = await prisma.user.findMany({
      where: { accountStatus: 'pending' },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        displayName: true, role: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users: pendingUsers });
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const newStatus = action === 'approve' ? 'active' : 'suspended';

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { accountStatus: newStatus as any },
      select: { id: true, email: true, displayName: true, accountStatus: true },
    });

    // Mock email notification
    console.log(`[EMAIL MOCK] Notification sent to ${updatedUser.email}: Account ${action}d.`);

    // Log to audit
    await prisma.auditLog.create({
      data: {
        action: `user_${action}`,
        actorId: session.user.id,
        entity: 'user',
        entityId: userId,
        details: { status: newStatus },
      },
    });

    return NextResponse.json({ user: updatedUser, message: `User ${action}d successfully` });
  } catch (error) {
    console.error('Error processing approval:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
