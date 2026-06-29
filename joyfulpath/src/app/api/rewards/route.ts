import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const rewards = await prisma.reward.findMany({ where: { isActive: true } });
    return NextResponse.json(rewards);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load rewards' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, rewardId } = body;

    // Create a redemption request
    const redemption = await prisma.rewardRedemption.create({
      data: {
        userId,
        rewardId,
      },
    });

    return NextResponse.json(redemption, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to request redemption' }, { status: 500 });
  }
}
