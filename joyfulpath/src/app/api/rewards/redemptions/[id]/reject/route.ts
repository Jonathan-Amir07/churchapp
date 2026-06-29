import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { reviewerId, notes } = body;

    const updated = await prisma.rewardRedemption.update({
      where: { id },
      data: { status: 'rejected', reviewedBy: reviewerId, reviewedAt: new Date(), notes },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to reject redemption' }, { status: 500 });
  }
}
