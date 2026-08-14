import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;

    if (user.role !== 'parent') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const childId = searchParams.get('child');

    if (!childId) {
      return NextResponse.json({ error: 'Missing child parameter' }, { status: 400 });
    }

    // Verify this parent has this child
    const family = await prisma.family.findFirst({
      where: {
        OR: [
          { fatherId: user.id },
          { motherId: user.id }
        ],
        children: {
          some: {
            id: childId
          }
        }
      }
    });

    if (!family) {
      return NextResponse.json({ error: 'Not authorized for this child' }, { status: 403 });
    }

    // Fetch the child profile
    const childProfile = await prisma.user.findUnique({
      where: { id: childId },
      select: { displayName: true }
    });

    // Fetch lessons progress
    const lessonsProgress = await prisma.lessonProgress.findMany({
      where: { userId: childId },
      include: {
        lesson: { select: { title: true } }
      }
    });

    const formattedProgress = lessonsProgress.map((p: any) => ({
      id: p.id,
      progress_pct: p.progressPct,
      lessons: { title: p.lesson.title }
    }));

    // Fetch quiz attempts
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { studentId: childId },
      include: {
        quiz: { select: { title: true } }
      },
      orderBy: { completedAt: 'desc' }
    });

    const formattedQuizzes = quizAttempts.map((q: any) => ({
      id: q.id,
      score: q.score,
      total_possible: q.totalPossible,
      percentage: Number(q.percentage),
      passed: q.passed,
      completed_at: q.completedAt.toISOString(),
      quizzes: { title: q.quiz.title }
    }));

    return NextResponse.json({ 
      profile: childProfile, 
      progress: formattedProgress, 
      quizzes: formattedQuizzes 
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
