// Event RSVP API - Register/Unregister for events
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient as createClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    const { eventId, userId, action = 'rsvp' } = body; // action: 'rsvp' | 'cancel'

    if (!eventId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing eventId or userId' },
        { status: 400 }
      );
    }

    if (action === 'cancel') {
      // Cancel RSVP
      const { error } = await supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: 'RSVP cancelled'
      });
    }

    if (action === 'cancel') {
      // Cancel RSVP
      const { error } = await supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: 'RSVP cancelled'
      });
    }

    // Register for event
    const { data: existing } = await supabase
      .from('event_attendees')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Already registered for this event' },
        { status: 409 }
      );
    }

    const { data: attendee, error } = await supabase
      .from('event_attendees')
      .insert({
        event_id: eventId,
        user_id: userId,
        rsvp_status: 'registered',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: attendee,
      message: 'Successfully registered for the event!'
    });
  } catch (err) {
    console.error('[events/rsvp] POST Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to process RSVP' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const userId = searchParams.get('userId');

    if (eventId) {
      const { data: attendees, error } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        eventId,
        attendees,
        count: attendees?.length || 0
      });
    }

    if (userId) {
      const { data: registrations, error } = await supabase
        .from('event_attendees')
        .select('event_id')
        .eq('user_id', userId);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        userId,
        registeredEvents: registrations?.map((r: any) => r.event_id) || []
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provide eventId or userId query param' },
      { status: 400 }
    );
  } catch (err) {
    console.error('[events/rsvp] GET Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}
