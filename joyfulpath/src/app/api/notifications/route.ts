import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/client';

/**
 * GET /api/notifications - List user notifications
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const supabase = createClient();

    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      notifications: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('GET /api/notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications - Create notification (admin/server only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !['admin', 'instructor'].includes(session.user.role as string)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
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

    const supabase = createClient();

    // Determine target users
    let targetUserIds: string[] = [];
    if (userId) {
      targetUserIds = [userId];
    } else if (targetIds) {
      targetUserIds = targetIds; // e.g., all users in a class
    } else {
      // Broadcast to all active students
      const users = await prisma.user.findMany({
        where: { role: 'student', isActive: true },
        select: { id: true },
      });
      targetUserIds = users.map(u => u.id);
    }

    // Create notifications
    const notifications = targetUserIds.map(uid => ({
      user_id: uid,
      title_en,
      title_ar,
      message_en,
      message_ar,
      type: type || 'announcement',
      action_url: actionUrl,
      is_read: false,
      created_at: new Date().toISOString(),
    }));

    const { data: inserted, error } = await supabase
      .from('notifications')
      .insert(notifications)
      .select();

    if (error) throw error;

    // Send push notifications if requested
    if (sendPush && inserted && inserted.length > 0) {
      // Queue push notification job
      console.log(`Queued push notifications for ${targetUserIds.length} users`);
      // In production, trigger Firebase Cloud Messaging here
    }

    return NextResponse.json(
      { notifications: inserted, queued: sendPush ? targetUserIds.length : 0 },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
