import { NextResponse } from 'next/server';
import { createSession } from '@/lib/gameSessionStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { gameType, hostUserId, initialState } = body;
    const id = await createSession(gameType, hostUserId, initialState || {});
    return NextResponse.json({ sessionId: id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to start game session' }, { status: 500 });
  }
}
