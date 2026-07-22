// Events Management API - Create, Read, Update, Delete
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient as createClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    const classId = searchParams.get('classId');
    const status = searchParams.get('status'); // 'upcoming', 'past', 'all'
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabase
      .from('events')
      .select('*, event_attendees(count)')
      .order('event_date', { ascending: true });

    if (classId) {
      query = query.eq('class_id', classId);
    }

    if (status === 'upcoming') {
      query = query.gte('event_date', new Date().toISOString());
    } else if (status === 'past') {
      query = query.lt('event_date', new Date().toISOString());
    }

    query = query.limit(limit);

    const { data: events, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: events,
      count: events?.length || 0
    });
  } catch (error) {
    console.error('GET /api/events error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    // Validate required fields
    const { title_en, title_ar, description_en, description_ar, event_date, location, capacity, event_type, class_id } = body;
    
    if (!title_en || !event_date || !location || !event_type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        title_en,
        title_ar: title_ar || title_en,
        description_en,
        description_ar: description_ar || description_en,
        event_date,
        location,
        capacity: capacity || 100,
        event_type,
        class_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, data: event },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/events error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID required' },
        { status: 400 }
      );
    }

    const { data: event, error } = await supabase
      .from('events')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('PATCH /api/events error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('DELETE /api/events error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
