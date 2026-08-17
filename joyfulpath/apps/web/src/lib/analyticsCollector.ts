import prisma from '@/lib/db';

export async function collectEvent(event: any) {
  try {
    // Store lightweight analytics in ActivityLog for now
    await prisma.activityLog.create({
      data: {
        userId: event.payload?.userId || event.payload?.actorId || 'system',
        action: `ANALYTICS_${event.type}`,
        entityType: event.payload?.entityType || 'event',
        entityId: event.payload?.entityId,
        metadata: event.payload || {},
      },
    });
  } catch (err) {
    console.error('Analytics collector error', err);
  }
}

export default { collectEvent };
