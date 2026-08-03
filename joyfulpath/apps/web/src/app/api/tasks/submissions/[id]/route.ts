import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;
    if (user.role !== 'admin' && user.role !== 'priest' && user.role !== 'instructor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { approved, feedback } = body;

    const submission = await prisma.taskSubmission.findUnique({
      where: { id },
      include: { task: true }
    });

    if (!submission) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    if (user.role === 'instructor') {
      const classCheck = await prisma.class.findUnique({ where: { id: submission.task.classId } });
      if (!classCheck || classCheck.instructorId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const updated = await prisma.taskSubmission.update({
      where: { id },
      data: {
        status: approved ? 'graded' : 'rejected',
        grade: approved ? submission.task.pointsReward : 0,
        feedback: feedback || null
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
