// Event Details - Get, Update, Delete single event
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient as createClient } from '@/lib/supabase/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const eventId = (await params).id;

    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        event_attendees(
          id,
          user_id,
          rsvp_status,
          created_at
        )
      `)
      .eq('id', eventId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Event not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('GET /api/events/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const eventId = (await params).id;
    const body = await request.json();

    const { data: event, error } = await supabase
      .from('events')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Event not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('PATCH /api/events/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const eventId = (await params).id;

    // Delete associated event attendees first (cascade)
    await supabase
      .from('event_attendees')
      .delete()
      .eq('event_id', eventId);

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Event not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('DELETE /api/events/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
