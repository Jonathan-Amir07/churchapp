import { NextResponse } from 'next/server';
import { updateSessionState, getSessionState } from '@/lib/gameSessionStore';
import { publishEvent } from '@/lib/eventBus';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { action } = body;

    // Merge action into state for simplicity
    const updated = await updateSessionState(id, { lastAction: action, lastActionAt: new Date().toISOString() });

    // Emit event for analytics/achievement
    await publishEvent('events', { type: 'GAME_ACTION', timestamp: new Date().toISOString(), payload: { sessionId: id, action } });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to apply action' }, { status: 500 });
  }
}
