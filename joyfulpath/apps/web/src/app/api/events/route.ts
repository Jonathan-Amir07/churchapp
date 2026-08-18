import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;

    const whereClause: any = {};
    if (user.role === 'student' || user.role === 'parent') {
      whereClause.isPublic = true;
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { date: 'asc' }
    });

    const formatted = events.map((e: any) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      type: e.type,
      date: e.date.toISOString().split('T')[0],
      time: e.time,
      end_time: e.endTime,
      location: e.location,
      max_capacity: e.maxCapacity,
      current_rsvp: e.currentRsvp,
      is_public: e.isPublic
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;
    if (user.role !== 'admin' && user.role !== 'priest') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, type, date, time, end_time, location, max_capacity, is_public } = body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        type,
        date: new Date(date),
        time,
        endTime: end_time,
        location,
        maxCapacity: max_capacity,
        isPublic: is_public
      }
    });

    return NextResponse.json(event);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
