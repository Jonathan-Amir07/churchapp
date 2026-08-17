import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { uploadFile } from '@/lib/supabase/storage';
import {
  requireAuth,
  isAdmin,
  verifyClassAccess,
  verifyParentChildAccess,
  type AuthSession,
} from '@/lib/rbac';

/**
 * GET /api/homework - List homework submissions
 * Query params: taskId, status (optional), studentId (optional)
 * 
 * Priest/Admin: can view all submissions.
 * Instructor: can view submissions for tasks in assigned classes.
 * Student: can only view their own submissions.
 * Parent: can view their children's submissions.
 */
export async function GET(request: NextRequest) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const session = result as AuthSession;

  try {
    const searchParams = request.nextUrl.searchParams;
    const taskId = searchParams.get('taskId');
    const status = searchParams.get('status');
    const studentId = searchParams.get('studentId');

    if (!taskId) {
      return NextResponse.json(
        { error: 'taskId is required' },
        { status: 400 }
      );
    }

    // Build query
    const where: any = { taskId };
    if (status) where.status = status;

    // Role-based scoping
    if (session.user.role === 'student') {
      // Students can only see their own submissions
      where.studentId = session.user.id;
    } else if (session.user.role === 'parent') {
      // Parents can only see their children's submissions
      if (!studentId) {
        return NextResponse.json(
          { error: 'studentId is required for parent access' },
          { status: 400 }
        );
      }
      const isChild = await verifyParentChildAccess(session.user.id, studentId);
      if (!isChild) {
        return NextResponse.json(
          { error: 'Access denied: this student is not your child' },
          { status: 403 }
        );
      }
      where.studentId = studentId;
    } else if (session.user.role === 'instructor') {
      // Instructors: verify the task belongs to an assigned class
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        select: { classId: true },
      });
      if (task) {
        const hasAccess = await verifyClassAccess(session.user.id, session.user.role, task.classId);
        if (!hasAccess) {
          return NextResponse.json(
            { error: 'Forbidden: you are not assigned to this class' },
            { status: 403 }
          );
        }
      }
      if (studentId) where.studentId = studentId;
    }
    // priest/admin: no additional filters

    const submissions = await prisma.taskSubmission.findMany({
      where,
      include: {
        student: { select: { id: true, displayName: true, avatarUrl: true } },
        reviewer: { select: { id: true, displayName: true } },
        task: { select: { id: true, title: true } },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('GET /api/homework error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/homework - Submit homework
 * Only students can submit homework.
 */
export async function POST(request: NextRequest) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const session = result as AuthSession;

  // Only students can submit homework
  if (session.user.role !== 'student') {
    return NextResponse.json(
      { error: 'Only students can submit homework' },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const taskId = formData.get('taskId') as string;
    const content = formData.get('content') as string;
    const file = formData.get('file') as File | null;

    if (!taskId) {
      return NextResponse.json(
        { error: 'taskId is required' },
        { status: 400 }
      );
    }

    // Verify task exists and student has access to the class
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true, maxSubmissions: true, classId: true },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const hasAccess = await verifyClassAccess(session.user.id, session.user.role, task.classId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied: you are not assigned to this class' },
        { status: 403 }
      );
    }

    // Check submission count
    const submissionCount = await prisma.taskSubmission.count({
      where: {
        taskId,
        studentId: session.user.id,
      },
    });

    if (submissionCount >= task.maxSubmissions) {
      return NextResponse.json(
        { error: 'Maximum submissions reached' },
        { status: 400 }
      );
    }

    let attachmentUrl: string | undefined;

    if (file && file.size > 0) {
      const uploadResult = await uploadFile({
        bucket: 'HOMEWORK',
        path: `${taskId}/${session.user.id}/${Date.now()}-${file.name}`,
        file,
      });
      attachmentUrl = uploadResult.url;
    }

    const submission = await prisma.taskSubmission.create({
      data: {
        taskId,
        studentId: session.user.id,
        content: content || undefined,
        attachmentUrl,
        status: 'pending',
        attemptNumber: submissionCount + 1,
      },
      include: {
        student: { select: { id: true, displayName: true, avatarUrl: true } },
        task: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/homework error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit homework' },
      { status: 500 }
    );
  }
}
