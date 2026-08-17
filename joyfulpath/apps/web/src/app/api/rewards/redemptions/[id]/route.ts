import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;
    if (user.role !== 'admin' && user.role !== 'priest') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, feedback } = body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const redemption = await prisma.rewardRedemption.findUnique({ where: { id } });
    if (!redemption) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (redemption.status !== 'pending') {
      return NextResponse.json({ error: 'Already processed' }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx: any) => {
      const updatedRedemption = await tx.rewardRedemption.update({
        where: { id },
        data: {
          status,
          notes: feedback || null,
          processedAt: new Date(),
          processedById: user.id
        }
      });

      // If rejected, refund the points and stock
      if (status === 'rejected') {
        await tx.user.update({
          where: { id: redemption.studentId },
          data: { totalPoints: { increment: redemption.pointsCost } }
        });
        await tx.reward.update({
          where: { id: redemption.rewardId },
          data: { stockLevel: { increment: 1 } }
        });
      }

      return updatedRedemption;
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
