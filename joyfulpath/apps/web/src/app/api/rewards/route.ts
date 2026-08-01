import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  requireAuth,
  verifyParentChildAccess,
  type AuthSession,
} from '@/lib/rbac';

/**
 * GET /api/rewards - List active rewards
 * Any authenticated user can list active rewards.
 */
export async function GET() {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;

  try {
    const rewards = await prisma.reward.findMany({ where: { isActive: true } });
    return NextResponse.json(rewards);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load rewards' }, { status: 500 });
  }
}

/**
 * POST /api/rewards - Redeem a reward
 * Student: can redeem for themselves.
 * Parent: can redeem for their children.
 * Priest/Admin/Instructor: cannot redeem rewards here (they approve them instead).
 */
export async function POST(req: NextRequest) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const session = result as AuthSession;

  try {
    const body = await req.json();
    const { userId, rewardId } = body;

    if (!userId || !rewardId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (session.user.role === 'student') {
      if (session.user.id !== userId) {
        return NextResponse.json({ error: 'Access denied: can only redeem for yourself' }, { status: 403 });
      }
    } else if (session.user.role === 'parent') {
      const isChild = await verifyParentChildAccess(session.user.id, userId);
      if (!isChild) {
        return NextResponse.json({ error: 'Access denied: student is not your child' }, { status: 403 });
      }
    } else {
      return NextResponse.json({ error: 'Only students and parents can redeem rewards' }, { status: 403 });
    }

    // Check if reward exists
    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward || !reward.isActive) {
      return NextResponse.json({ error: 'Reward is not available' }, { status: 400 });
    }

    // TODO: Verify if user has enough points (requires points system integration)

    // Create a redemption request
    const redemption = await prisma.rewardRedemption.create({
      data: {
        userId,
        rewardId,
        status: 'pending',
      },
    });

    return NextResponse.json(redemption, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to request redemption' }, { status: 500 });
  }
}
