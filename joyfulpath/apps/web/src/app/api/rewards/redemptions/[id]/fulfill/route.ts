import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { routeNotification } from '@/lib/notificationRouter';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { fulfillerId, notes } = body;

    // Update redemption status using raw SQL
    const updateSql = `UPDATE reward_redemptions SET status='fulfilled', reviewed_by=$2, reviewed_at=now(), notes=$3 WHERE id=$1 RETURNING *`;
    const updatedRows: any = await prisma.$queryRawUnsafe(updateSql, id, fulfillerId, notes);
    const updated = Array.isArray(updatedRows) ? updatedRows[0] : updatedRows;

    // Create activity log via raw SQL
    const activitySql = `INSERT INTO activity_log (id, user_id, action, entity_type, entity_id, metadata, xp_change, points_change, created_at)
      VALUES (gen_random_uuid(), $1, 'REWARD_FULFILLED', 'reward_redemption', $2, $3::jsonb, 0, 0, now())`;
    await prisma.$executeRawUnsafe(activitySql, updated.user_id ?? updated.userId, updated.id, JSON.stringify({ notes }));

    // Notify user
    await routeNotification({ userId: updated.user_id ?? updated.userId, channel: 'inapp', type: 'reward_fulfilled', payload: { redemptionId: updated.id, rewardId: updated.reward_id ?? updated.rewardId } });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fulfill redemption' }, { status: 500 });
  }
}
