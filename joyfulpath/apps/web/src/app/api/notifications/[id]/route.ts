import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

type Params = Promise<{ id: string }>;

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;
    const { id } = await params;
    const data = await request.json();
    const { isRead } = data;

    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    if (notification.userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: {
        isRead: isRead !== undefined ? isRead : true,
        readAt: isRead ? new Date() : null,
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;
    const { id } = await params;

    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    if (notification.userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    await prisma.notification.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}

