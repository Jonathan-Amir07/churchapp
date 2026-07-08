import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/db';
import { uploadFile } from '@/lib/supabase/storage';

/**
 * GET /api/homework - List homework submissions
 * Query params: taskId, status (optional), studentId (optional)
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
    if (studentId) where.studentId = studentId;
    if (session.user.role === 'student') {
      where.studentId = session.user.id;
    }

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
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Verify task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true, maxSubmissions: true },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
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
        bucket: 'homework',
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
