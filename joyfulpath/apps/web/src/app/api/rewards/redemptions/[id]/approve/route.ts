import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { routeNotification } from '@/lib/notificationRouter';


export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { reviewerId, shippingInfo } = body;

    // load redemption and reward
    const redemption = await prisma.rewardRedemption.findUnique({ where: { id }, include: { reward: true } });
    if (!redemption) return NextResponse.json({ error: 'Redemption not found' }, { status: 404 });

    const updated = await prisma.rewardRedemption.update({
      where: { id },
      data: { status: 'approved', reviewedBy: reviewerId, reviewedAt: new Date(), shippingInfo },
    });

    // Deduct inventory if applicable (safe)
    try {
      if (redemption.reward?.inventoryCount !== null && redemption.reward?.inventoryCount !== undefined) {
        await prisma.reward.update({ where: { id: redemption.rewardId }, data: { inventoryCount: { decrement: 1 } } });
      }
    } catch (err) {
      console.warn('Inventory decrement failed', err);
    }

    // Deduct XP cost if configured
    try {
      const cost = redemption.reward?.costXp ?? 0;
      if (cost > 0) {
        await prisma.xpEntry.create({ data: { userId: redemption.userId, source: 'reward_redemption', sourceId: redemption.id, xpAmount: -cost } });
        // update user's totalXp (clamp to 0)
        const user = await prisma.user.findUnique({ where: { id: redemption.userId } });
        if (user) {
          const newTotal = Math.max(0, (user.totalXp || 0) - cost);
          await prisma.user.update({ where: { id: user.id }, data: { totalXp: newTotal } });
        }
      }
    } catch (err) {
      console.warn('XP deduction failed', err);
    }

    // Activity log
    await prisma.activityLog.create({
      data: {
        userId: redemption.userId,
        action: 'REWARD_APPROVED',
        entityType: 'reward_redemption',
        entityId: redemption.id,
        metadata: { rewardId: redemption.rewardId, reviewerId },
      },
    });

    // Notify user
    try {
      await routeNotification({ userId: redemption.userId, channel: 'inapp', type: 'reward_approved', payload: { redemptionId: redemption.id, rewardId: redemption.rewardId } });
    } catch (err) {
      console.warn('Notification failed', err);
    }

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to approve redemption' }, { status: 500 });
  }
}
