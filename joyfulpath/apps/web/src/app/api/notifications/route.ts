import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/client';
import {
  requireAuth,
  requireRole,
  USER_MANAGEMENT_ROLES,
  type AuthSession,
} from '@/lib/rbac';

/**
 * GET /api/notifications - List user notifications
 * Any authenticated user can view their own notifications.
 */
export async function GET(request: NextRequest) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const session = result as AuthSession;

  try {
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
 * POST /api/notifications - Create notification
 * Only priest/admin can broadcast/create notifications.
 */
export async function POST(request: NextRequest) {
  const result = await requireRole(USER_MANAGEMENT_ROLES);
  if (result instanceof NextResponse) return result;
  const session = result as AuthSession;

  try {
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
      targetUserIds = users.map((u: any) => u.id);
    }

    // Create notifications
    const notifications = targetUserIds.map((uid: any) => ({
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
      console.log(`Queued push notifications for ${targetUserIds.length} users`);
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
