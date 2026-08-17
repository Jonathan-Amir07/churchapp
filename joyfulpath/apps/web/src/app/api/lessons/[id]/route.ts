import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  requireAuth,
  requireRole,
  isAdmin,
  canHardDelete,
  verifyClassAccess,
  CONTENT_MANAGER_ROLES,
  type AuthSession,
} from '@/lib/rbac';

type Params = Promise<{ id: string }>;

/**
 * GET /api/lessons/[id] - Get lesson details with attachments
 * 
 * Priest/Admin: can view any lesson.
 * Instructor: can view lessons in assigned classes.
 * Student: can view published lessons in assigned classes.
 * Parent: blocked.
 */
export async function GET(request: NextRequest, { params }: { params: Params }) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const session = result as AuthSession;

  try {
    const { id } = await params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        attachments: true,
        creator: { select: { id: true, displayName: true, avatarUrl: true } },
        class: { select: { id: true, name: true } },
        progress: session.user.id
          ? { where: { userId: session.user.id } }
          : false,
        _count: {
          select: {
            progress: true,
            tasks: true,
            quizzes: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Verify class access
    const hasAccess = await verifyClassAccess(session.user.id, session.user.role, lesson.classId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied: you are not assigned to this class' },
        { status: 403 }
      );
    }

    // Students cannot view draft lessons
    if (lesson.status === 'draft' && session.user.role === 'student') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ...lesson,
      progress: lesson.progress?.[0] || null,
    });
  } catch (error) {
    console.error('GET /api/lessons/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/lessons/[id] - Update lesson
 * 
 * Priest/Admin: can update any lesson.
 * Instructor: can update lessons only in assigned classes.
 * Others: blocked.
 */
export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const result = await requireRole(CONTENT_MANAGER_ROLES);
  if (result instanceof NextResponse) return result;
  const session = result as AuthSession;

  try {
    const { id } = await params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      select: { createdBy: true, classId: true },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Verify class access for instructors
    const hasAccess = await verifyClassAccess(session.user.id, session.user.role, lesson.classId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: you are not assigned to this class' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { title, description, content, bibleReferences, thumbnailUrl, xpReward, pointsReward, orderIndex, status, publishedAt } = data;

    const updated = await prisma.lesson.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(content && { content }),
        ...(bibleReferences && { bibleReferences }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(xpReward !== undefined && { xpReward }),
        ...(pointsReward !== undefined && { pointsReward }),
        ...(orderIndex !== undefined && { orderIndex }),
        ...(status && { status, publishedAt: status === 'published' ? new Date() : publishedAt }),
      },
      include: { attachments: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH /api/lessons/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/lessons/[id] - Permanently delete lesson
 * 
 * Priest/Admin: can delete.
 * Instructor: CANNOT permanently delete (returns 403). Use PATCH to archive instead.
 * Others: blocked.
 */
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const session = result as AuthSession;

  // Instructors cannot permanently delete records
  if (!canHardDelete(session.user.role)) {
    return NextResponse.json(
      { error: 'Forbidden: instructors cannot permanently delete records. Use archive instead.' },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      select: { createdBy: true },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    await prisma.lesson.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/lessons/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
}
