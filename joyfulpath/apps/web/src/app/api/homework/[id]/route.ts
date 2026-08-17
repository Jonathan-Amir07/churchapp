import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  requireAuth,
  requireRole,
  isAdmin,
  verifyClassAccess,
  verifyParentChildAccess,
  CONTENT_MANAGER_ROLES,
  type AuthSession,
} from '@/lib/rbac';

type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'revision_requested';
type Params = Promise<{ id: string }>;

/**
 * GET /api/homework/[id] - Get submission details
 */
export async function GET(request: NextRequest, { params }: { params: Params }) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const session = result as AuthSession;

  try {
    const { id } = await params;

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
    if (session.user.role === 'student') {
      if (session.user.id !== submission.studentId) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    } else if (session.user.role === 'parent') {
      const isChild = await verifyParentChildAccess(session.user.id, submission.studentId);
      if (!isChild) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    } else if (session.user.role === 'instructor') {
      const hasAccess = await verifyClassAccess(session.user.id, session.user.role, submission.task.classId);
      if (!hasAccess) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
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
 * 
 * Priest/Admin: can review any submission.
 * Instructor: can review submissions for their assigned classes.
 * Others: blocked.
 */
export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const result = await requireRole(CONTENT_MANAGER_ROLES);
  if (result instanceof NextResponse) return result;
  const session = result as AuthSession;

  try {
    const { id } = await params;

    const submission = await prisma.taskSubmission.findUnique({
      where: { id },
      include: { task: { select: { createdBy: true, classId: true } } },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Instructors must be assigned to the class to review it
    const hasAccess = await verifyClassAccess(session.user.id, session.user.role, submission.task.classId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: you are not assigned to this class' },
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

    // Award XP/Points if approved (mock functionality here)
    if (status === 'approved' && (xpAwarded || pointsAwarded)) {
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
