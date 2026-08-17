import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const body = await req.json();
    const { eventId, userId, action = 'rsvp' } = body;

    if (!eventId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing eventId or userId' },
        { status: 400 }
      );
    }

    if (action === 'cancel') {
      await prisma.eventAttendee.deleteMany({
        where: {
          eventId,
          userId
        }
      });
      
      return NextResponse.json({
        success: true,
        message: 'RSVP cancelled'
      });
    }

    // Register for event
    const existing = await prisma.eventAttendee.findFirst({
      where: {
        eventId,
        userId
      }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Already registered for this event' },
        { status: 409 }
      );
    }

    const attendee = await prisma.eventAttendee.create({
      data: {
        eventId,
        userId,
        rsvpStatus: 'registered'
      }
    });

    return NextResponse.json({
      success: true,
      data: attendee,
      message: 'Successfully registered for the event!'
    });
  } catch (err: any) {
    console.error('[events/rsvp] POST Error:', err);
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to process RSVP' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const userId = searchParams.get('userId');

    if (eventId) {
      const attendees = await prisma.eventAttendee.findMany({
        where: { eventId }
      });

      return NextResponse.json({
        success: true,
        eventId,
        attendees,
        count: attendees.length
      });
    }

    if (userId) {
      const registrations = await prisma.eventAttendee.findMany({
        where: { userId },
        select: { eventId: true }
      });

      return NextResponse.json({
        success: true,
        userId,
        registeredEvents: registrations.map((r: any) => r.eventId)
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provide eventId or userId query param' },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('[events/rsvp] GET Error:', err);
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}
