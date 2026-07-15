import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/db';
import { UserRole } from '@prisma/client';

/**
 * GET /api/lessons - List lessons for a class
 * Query params: classId, status (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const classId = searchParams.get('classId');
    const status = searchParams.get('status');

    if (!classId) {
      return NextResponse.json(
        { error: 'classId is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this class
    const classAccess = await prisma.class.findFirst({
      where: {
        id: classId,
        OR: [
          { createdBy: session.user.id },
          { members: { some: { userId: session.user.id } } },
        ],
      },
    });

    if (!classAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const where: any = { classId };
    if (status) where.status = status;

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        attachments: true,
        progress: session.user.id
          ? { where: { userId: session.user.id } }
          : false,
        _count: {
          select: { progress: true },
        },
      },
      orderBy: { orderIndex: 'asc' },
    });

    return NextResponse.json({
      lessons: lessons.map((lesson: any) => ({
        ...lesson,
        progress: lesson.progress?.[0] || null,
      })),
    });
  } catch (error) {
    console.error('GET /api/lessons error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/lessons - Create a new lesson
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !['instructor', 'admin'].includes(session.user.role as string)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { classId, title, description, content, bibleReferences, thumbnailUrl, xpReward, pointsReward, orderIndex } = data;

    if (!classId || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify instructor has access to class
    const classAccess = await prisma.class.findFirst({
      where: {
        id: classId,
        OR: [
          { createdBy: session.user.id },
          { members: { some: { userId: session.user.id, role: 'instructor' as UserRole } } },
        ],
      },
    });

    if (!classAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const lesson = await prisma.lesson.create({
      data: {
        classId,
        title,
        description,
        content,
        bibleReferences: bibleReferences || [],
        thumbnailUrl,
        xpReward: xpReward || 50,
        pointsReward: pointsReward || 10,
        orderIndex: orderIndex || 0,
        status: 'draft',
        createdBy: session.user.id,
      },
      include: {
        attachments: true,
      },
    });

    return NextResponse.json((lesson as any), { status: 201 });
  } catch (error) {
    console.error('POST /api/lessons error:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}
