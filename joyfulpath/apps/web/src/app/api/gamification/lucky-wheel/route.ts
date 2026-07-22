import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { GAMIFICATION } from '@/lib/constants';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Logic for lucky wheel spin
    const rewards = [
      { type: 'xp', value: 50 },
      { type: 'points', value: 10 },
      { type: 'xp', value: 100 },
      { type: 'points', value: 25 },
      { type: 'badge', value: 'lucky_spinner' }
    ];

    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

    return NextResponse.json({ success: true, message: 'Wheel spun successfully', reward: randomReward });
  } catch (error) {
    console.error('Lucky Wheel POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
