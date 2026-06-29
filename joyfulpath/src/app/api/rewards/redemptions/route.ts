import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const redemptions = await prisma.rewardRedemption.findMany({ orderBy: { requestedAt: 'desc' } });
    return NextResponse.json(redemptions);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch redemptions' }, { status: 500 });
  }
}
