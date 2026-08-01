import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/db';
import {
  requireAuth,
  requireRole,
  isAdmin,
  verifyClassAccess,
  CONTENT_MANAGER_ROLES,
  type AuthSession,
} from '@/lib/rbac';

/**
 * GET /api/lessons - List lessons for a class
 * Query params: classId, status (optional)
 * 
 * Priest/Admin: can view all lessons in any class.
 * Instructor: can only view lessons in assigned classes.
 * Student: can only view published lessons in assigned classes.
 * Parent: blocked (they access child data via /api/homework).
 */
export async function GET(request: NextRequest) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const session = result as AuthSession;

  try {
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
    const hasAccess = await verifyClassAccess(session.user.id, session.user.role, classId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied: you are not assigned to this class' },
        { status: 403 }
      );
    }

    const where: any = { classId };
    if (status) where.status = status;

    // Students can only see published lessons
    if (session.user.role === 'student') {
      where.status = 'published';
    }

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
 * 
 * Priest/Admin: can create lessons for any class.
 * Instructor: can create lessons only for assigned classes.
 * Others: blocked.
 */
export async function POST(request: NextRequest) {
  const result = await requireRole(CONTENT_MANAGER_ROLES);
  if (result instanceof NextResponse) return result;
  const session = result as AuthSession;

  try {
    const data = await request.json();
    const { classId, title, description, content, bibleReferences, thumbnailUrl, xpReward, pointsReward, orderIndex } = data;

    if (!classId || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Instructors must be assigned to this class
    const hasAccess = await verifyClassAccess(session.user.id, session.user.role, classId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: you are not assigned to this class' },
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
