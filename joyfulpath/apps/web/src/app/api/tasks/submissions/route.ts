import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;

    const whereClause: any = {
      status: 'submitted', // we only want to review pending ones
    };

    if (user.role === 'instructor') {
      const instructorClasses = await prisma.class.findMany({
        where: { instructorId: user.id },
        select: { id: true }
      });
      const classIds = instructorClasses.map((c: any) => c.id);
      
      whereClause.task = {
        classId: { in: classIds }
      };
    } else if (user.role !== 'admin' && user.role !== 'priest') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const submissions = await prisma.taskSubmission.findMany({
      where: whereClause,
      include: {
        student: true,
        task: true
      },
      orderBy: { submittedAt: 'desc' }
    });

    const formatted = submissions.map((sub: any) => ({
      id: sub.id,
      studentName: sub.student.displayName || sub.student.username,
      taskTitleEn: sub.task.title,
      taskTitleAr: sub.task.description || sub.task.title,
      submissionText: sub.content,
      submittedAt: sub.submittedAt,
      points: sub.task.pointsReward,
      attachedFiles: [], // Simplified for now since attachment model might differ
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
