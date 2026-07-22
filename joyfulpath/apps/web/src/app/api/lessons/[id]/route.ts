import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/db';
import { UserRole } from '@prisma/client';

type Params = Promise<{ id: string }>;

/**
 * GET /api/lessons/[id] - Get lesson details with attachments
 */
export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const session = await auth();

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        attachments: true,
        creator: { select: { id: true, displayName: true, avatarUrl: true } },
        class: { select: { id: true, name: true } },
        progress: session?.user?.id
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

    // Check access
    if (lesson.status === 'draft' && session?.user?.id !== lesson.createdBy) {
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
 */
export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Verify authorization
    if (lesson.createdBy !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied' },
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
 * DELETE /api/lessons/[id] - Delete lesson
 */
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    if (lesson.createdBy !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
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
