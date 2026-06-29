import { NextResponse } from 'next/server';
import { endSession, persistSessionToDb, getSessionState } from '@/lib/gameSessionStore';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const state = await getSessionState(id);
    await persistSessionToDb(id);
    await endSession(id);
    return NextResponse.json({ sessionId: id, ended: true, state });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to end session' }, { status: 500 });
  }
}
