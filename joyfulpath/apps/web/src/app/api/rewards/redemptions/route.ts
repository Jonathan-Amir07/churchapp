import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;
    let whereClause: any = {};
    if (user.role === 'student') {
      whereClause.studentId = user.id;
    } else if (user.role !== 'admin' && user.role !== 'priest') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const redemptions = await prisma.rewardRedemption.findMany({
      where: whereClause,
      include: {
        student: true,
        reward: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = redemptions.map((r: any) => ({
      id: r.id,
      studentName: r.student.displayName || r.student.username,
      itemTitle: r.reward.titleEn,
      pointsCost: r.pointsCost,
      status: r.status,
      createdAt: r.createdAt.toLocaleDateString(),
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;
    if (user.role !== 'student') {
      return NextResponse.json({ error: 'Forbidden. Only students can redeem rewards.' }, { status: 403 });
    }

    const body = await req.json();
    const { rewardId } = body;

    if (!rewardId) {
      return NextResponse.json({ error: 'Missing rewardId' }, { status: 400 });
    }

    const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 });
    }

    if (reward.stockLevel <= 0) {
      return NextResponse.json({ error: 'Reward out of stock' }, { status: 400 });
    }

    const student = await prisma.user.findUnique({ where: { id: user.id } });
    if (!student || student.totalPoints < reward.pointsCost) {
      return NextResponse.json({ error: 'Not enough points' }, { status: 400 });
    }

    // Process inside a transaction
    const redemption = await prisma.$transaction(async (tx: any) => {
      // Deduct points
      await tx.user.update({
        where: { id: user.id },
        data: { totalPoints: { decrement: reward.pointsCost } }
      });

      // Decrease stock
      await tx.reward.update({
        where: { id: rewardId },
        data: { stockLevel: { decrement: 1 } }
      });

      // Create redemption record
      return await tx.rewardRedemption.create({
        data: {
          studentId: user.id,
          rewardId: reward.id,
          pointsCost: reward.pointsCost,
          status: 'pending'
        }
      });
    });

    return NextResponse.json(redemption);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
