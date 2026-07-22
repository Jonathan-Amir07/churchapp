import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, classId, type, title, body: message, isPrivate } = body;

    const prayer = await prisma.prayerRequest.create({
      data: {
        studentId,
        classId: classId || null,
        type,
        title,
        body: message,
        isPrivate: !!isPrivate,
      },
    });

    return NextResponse.json(prayer, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create prayer request' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const classId = url.searchParams.get('classId');
    const studentId = url.searchParams.get('studentId');

    const where: any = {};
    if (classId) where.classId = classId;
    if (studentId) where.studentId = studentId;

    const prayers = await prisma.prayerRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(prayers);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch prayer requests' }, { status: 500 });
  }
}
