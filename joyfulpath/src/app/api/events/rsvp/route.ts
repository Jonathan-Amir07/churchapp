// src/app/api/events/rsvp/route.ts
// MOCK: RSVP toggle API — no real DB used.
// See waiting_database.md > Phase 6 for migration guide.

import { NextRequest, NextResponse } from 'next/server';

// ── In-memory RSVP store (simulates event_registrations table) ────────────
// MOCK: replace with Supabase INSERT / DELETE on real migration
const mockRsvps = new Map<string, Set<string>>(); // eventId → Set<userId>

// Pre-seed with the mock data from mockClient.ts
mockRsvps.set('event-1', new Set(['mock-student-id', 'mock-parent-id']));
mockRsvps.set('event-2', new Set(['mock-student-id']));

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, userId, action } = body; // action: 'rsvp' | 'cancel'

    if (!eventId || !userId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing eventId, userId, or action.' },
        { status: 400 }
      );
    }

    if (!mockRsvps.has(eventId)) {
      mockRsvps.set(eventId, new Set());
    }

    const rsvpSet = mockRsvps.get(eventId)!;

    if (action === 'rsvp') {
      // ── MOCK: INSERT INTO event_registrations (event_id, user_id) VALUES (...) ──
      // REAL DB: supabase.from('event_registrations').insert({ event_id: eventId, user_id: userId })
      rsvpSet.add(userId);
      return NextResponse.json({
        success: true,
        action: 'rsvp',
        eventId,
        userId,
        message: 'Successfully registered for the event!',
      });
    } else if (action === 'cancel') {
      // ── MOCK: DELETE FROM event_registrations WHERE event_id=? AND user_id=? ──
      // REAL DB: supabase.from('event_registrations').delete().eq('event_id', eventId).eq('user_id', userId)
      rsvpSet.delete(userId);
      return NextResponse.json({
        success: true,
        action: 'cancel',
        eventId,
        userId,
        message: 'RSVP cancelled successfully.',
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Use "rsvp" or "cancel".' },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error('[events/rsvp] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Return all RSVPs for a given event or user
  // REAL DB: supabase.from('event_registrations').select('*').eq('event_id', eventId)
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  const userId  = searchParams.get('userId');

  if (eventId) {
    const rsvpSet = mockRsvps.get(eventId) ?? new Set();
    return NextResponse.json({ success: true, eventId, attendees: Array.from(rsvpSet) });
  }

  if (userId) {
    const registeredEvents: string[] = [];
    mockRsvps.forEach((users, evId) => {
      if (users.has(userId)) registeredEvents.push(evId);
    });
    return NextResponse.json({ success: true, userId, registeredEvents });
  }

  return NextResponse.json({ success: false, error: 'Provide eventId or userId query param.' }, { status: 400 });
}
