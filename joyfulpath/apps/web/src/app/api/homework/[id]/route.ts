import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/db';
import { SubmissionStatus } from '@prisma/client';

type Params = Promise<{ id: string }>;

/**
 * GET /api/homework/[id] - Get submission details
 */
export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const submission = await prisma.taskSubmission.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, displayName: true, avatarUrl: true } },
        reviewer: { select: { id: true, displayName: true } },
        task: {
          include: {
            creator: { select: { id: true, displayName: true } },
            class: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Verify access
    const isStudent = session.user.id === submission.studentId;
    const isReviewer = session.user.id === submission.reviewedBy;
    const isTaskCreator = session.user.id === submission.task.createdBy;
    const isAdmin = session.user.role === 'admin';

    if (!isStudent && !isReviewer && !isTaskCreator && !isAdmin) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error('GET /api/homework/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/homework/[id] - Review/update submission
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

    const submission = await prisma.taskSubmission.findUnique({
      where: { id },
      include: { task: { select: { createdBy: true } } },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Only admin can review
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { status, feedback, xpAwarded, pointsAwarded } = data;

    if (!status || !['approved', 'rejected', 'revision_requested', 'pending'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updated = await prisma.taskSubmission.update({
      where: { id },
      data: {
        status: status as SubmissionStatus,
        feedback,
        xpAwarded: xpAwarded || 0,
        pointsAwarded: pointsAwarded || 0,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      },
      include: {
        student: { select: { id: true, displayName: true, avatarUrl: true } },
        reviewer: { select: { id: true, displayName: true } },
      },
    });

    // Award XP/Points if approved
    if (status === 'approved' && (xpAwarded || pointsAwarded)) {
      // Emit event for XP/points update (integrate with existing points system)
      console.log('Award XP/Points:', {
        studentId: submission.studentId,
        xp: xpAwarded,
        points: pointsAwarded,
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH /api/homework/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}
