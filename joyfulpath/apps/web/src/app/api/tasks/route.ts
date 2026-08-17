import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;
    if (user.role !== 'admin' && user.role !== 'priest' && user.role !== 'instructor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { taskTitleEn, taskTitleAr, points, classId } = body;

    if (!taskTitleEn || !taskTitleAr || !classId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (user.role === 'instructor') {
      const classCheck = await prisma.class.findUnique({ where: { id: classId } });
      if (!classCheck || classCheck.instructorId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const task = await prisma.task.create({
      data: {
        title: taskTitleEn,
        description: taskTitleAr, // Using description for Arabic title as workaround since Task model schema might not have ar/en fields
        xpReward: points || 30,
        pointsReward: points || 30,
        classId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return NextResponse.json(task);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
