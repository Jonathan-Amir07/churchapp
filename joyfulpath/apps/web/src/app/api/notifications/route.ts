import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const whereClause: any = { userId: user.id };
    if (unreadOnly) {
      whereClause.readAt = null;
    }

    const notificationsDb = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });

    const notifications = notificationsDb.map((n: any) => {
      const payload = JSON.parse(n.payload || '{}');
      return {
        id: n.id,
        userId: n.userId,
        type: n.type,
        channel: n.channel,
        titleEn: payload.titleEn || '',
        titleAr: payload.titleAr || '',
        messageEn: payload.messageEn || '',
        messageAr: payload.messageAr || '',
        actionUrl: payload.actionUrl || '',
        isRead: !!n.readAt,
        createdAt: n.createdAt,
      };
    });

    const total = await prisma.notification.count({ where: whereClause });

    return NextResponse.json({
      notifications,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;
    if (user.role !== 'admin' && user.role !== 'priest') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();
    const {
      userId,
      title_en,
      title_ar,
      message_en,
      message_ar,
      type,
      actionUrl,
      targetIds,
      sendPush = false,
    } = data;

    if (!title_en || !message_en) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let targetUserIds: string[] = [];
    if (userId) {
      targetUserIds = [userId];
    } else if (targetIds && Array.isArray(targetIds)) {
      targetUserIds = targetIds;
    } else {
      const users = await prisma.user.findMany({
        where: { isActive: true },
        select: { id: true },
      });
      targetUserIds = users.map((u: any) => u.id);
    }

    const payloadObj = JSON.stringify({
      titleEn: title_en,
      titleAr: title_ar || title_en,
      messageEn: message_en,
      messageAr: message_ar || message_en,
      actionUrl: actionUrl,
    });

    const notifications = targetUserIds.map((uid) => ({
      userId: uid,
      channel: 'in-app',
      type: type || 'announcement',
      payload: payloadObj,
      readAt: null,
    }));

    await prisma.notification.createMany({
      data: notifications
    });

    return NextResponse.json(
      { success: true, queued: sendPush ? targetUserIds.length : 0 },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
