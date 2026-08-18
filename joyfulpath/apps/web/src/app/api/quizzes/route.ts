import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;

    const whereClause: any = {};
    if (user.role === 'instructor') {
      const instructorClasses = await prisma.class.findMany({
        where: { instructorId: user.id },
        select: { id: true }
      });
      const classIds = instructorClasses.map((c: any) => c.id);
      
      whereClause.classId = { in: classIds };
    }

    const quizzes = await prisma.quiz.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = quizzes.map((q: any) => ({
      id: q.id,
      titleEn: q.title,
      titleAr: q.description || q.title, // using description as fallback for Ar
      passingScore: q.passingScore,
      xp: q.xpReward,
      points: q.pointsReward,
      questionsCount: q._count.questions
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;
    if (user.role !== 'admin' && user.role !== 'priest' && user.role !== 'instructor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { titleEn, titleAr, passingScore, xp, points, classId } = body;

    if (!titleEn || !titleAr || !classId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (user.role === 'instructor') {
      const classCheck = await prisma.class.findUnique({ where: { id: classId } });
      if (!classCheck || classCheck.instructorId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: titleEn,
        description: titleAr,
        passingScore: parseInt(passingScore) || 70,
        xpReward: parseInt(xp) || 50,
        pointsReward: parseInt(points) || 10,
        classId
      }
    });

    return NextResponse.json(quiz);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
