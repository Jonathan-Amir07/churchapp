import { NextResponse } from 'next/server';
import { getSessionState } from '@/lib/gameSessionStore';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const state = await getSessionState(id);
    if (!state) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    return NextResponse.json(state);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch state' }, { status: 500 });
  }
}
