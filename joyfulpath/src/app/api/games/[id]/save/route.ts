import { NextResponse } from 'next/server';
import { persistSessionToDb } from '@/lib/gameSessionStore';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updated = await persistSessionToDb(id);
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
  }
}
