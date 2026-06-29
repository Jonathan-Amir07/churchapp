import { publishEvent } from './eventBus';
import prisma from '@/lib/db';
import { sendInAppNotification, sendPushNotification, sendEmailNotification } from './delivery';

export type NotificationRoute = {
  userId: string;
  channel: 'inapp' | 'push' | 'email';
  type: string;
  payload: any;
};

export async function routeNotification(route: NotificationRoute) {
  // Persist notification record for in-app history using raw SQL to avoid client type mismatch
  const insertSql = `INSERT INTO notifications (id, user_id, channel, type, payload, created_at)
    VALUES (gen_random_uuid(), $1, $2, $3, $4::jsonb, now()) RETURNING id, user_id, channel, type, payload, created_at`;
  const rows: any = await prisma.$queryRawUnsafe(insertSql, route.userId, route.channel, route.type, JSON.stringify(route.payload));
  const record = Array.isArray(rows) ? rows[0] : rows;

  // Publish event for downstream consumers
  await publishEvent('notifications', {
    type: 'NOTIFICATION_CREATED',
    payload: {
      notificationId: record.id,
      userId: route.userId,
      channel: route.channel,
      type: route.type,
      payload: route.payload,
    },
  });

  // Fire delivery adapters (best-effort, async)
  try {
    if (route.channel === 'inapp') {
      await sendInAppNotification(record as any);
    } else if (route.channel === 'push') {
      await sendPushNotification(record as any);
    } else if (route.channel === 'email') {
      await sendEmailNotification(record as any);
    }
  } catch (err) {
    console.error('Delivery adapter error', err);
  }

  return record;
}

export default { routeNotification };
