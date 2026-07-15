import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/db';

/**
 * GET /api/analytics/dashboard - Admin dashboard analytics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !['admin', 'instructor'].includes(session.user.role as string)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const classId = searchParams.get('classId');
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date();

    // Build where clause for class if instructor
    const classWhere = session.user.role === 'instructor' && classId ? { classId } : {};

    // 1. Student Engagement Metrics
    const engagementMetrics = await prisma.pointsTransaction.groupBy({
      by: ['userId'],
      where: {
        awardedAt: {
          gte: startDate,
          lte: endDate,
        },
        ...(classId && { lesson: { classId } }),
      },
      _sum: {
        xpAwarded: true,
        pointsAwarded: true,
      },
    });

    // 2. Lesson Completion Stats
    const lessonStats = await prisma.lesson.findMany({
      where: classWhere,
      select: {
        id: true,
        title: true,
        createdAt: true,
        progress: {
          select: {
            status: true,
          },
        },
      },
    });

    const lessonCompletion = lessonStats.map((lesson: any) => ({
      lessonId: lesson.id,
      title: lesson.title,
      total: lesson.progress.length,
      completed: lesson.progress.filter((p: any) => p.status === 'completed').length,
      inProgress: lesson.progress.filter((p: any) => p.status === 'in_progress').length,
      notStarted: lesson.progress.filter((p: any) => p.status === 'not_started').length,
      completionRate: lesson.progress.length > 0
        ? Math.round((lesson.progress.filter((p: any) => p.status === 'completed').length / lesson.progress.length) * 100)
        : 0,
    }));

    // 3. Quiz Performance
    const quizStats = await prisma.quiz.findMany({
      where: classWhere,
      include: {
        attempts: {
          select: {
            score: true,
            totalQuestions: true,
            completedAt: true,
          },
        },
      },
    });

    const quizPerformance = quizStats.map((quiz: any) => {
      const attempts = quiz.attempts;
      const avgScore = attempts.length > 0
        ? Math.round(attempts.reduce((sum: any, a: any) => sum + (a.score || 0), 0) / attempts.length)
        : 0;
      return {
        quizId: quiz.id,
        title: quiz.title,
        attempts: attempts.length,
        averageScore: avgScore,
        passRate: attempts.length > 0
          ? Math.round((attempts.filter((a: any) => a.score! >= quiz.passingScore).length / attempts.length) * 100)
          : 0,
      };
    });

    // 4. Attendance Data
    const attendanceData = await prisma.attendance.groupBy({
      by: ['date', 'status'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        ...(classId && { classId }),
      },
      _count: {
        id: true,
      },
    });

    // 5. Top Students (by XP)
    const topStudents = await prisma.user.findMany({
      where: {
        role: 'student',
        ...(classId && {
          classMembers: {
            some: { classId },
          },
        }),
      },
      select: {
        id: true,
        displayName: true,
        totalXp: true,
        totalPoints: true,
        currentStreak: true,
        studentBadges: {
          select: {
            badge: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { totalXp: 'desc' },
      take: 10,
    });

    // 6. Badge Distribution
    const badgeDistribution = await prisma.studentBadge.groupBy({
      by: ['badgeId'],
      where: {
        ...(classId && {
          student: {
            classMembers: { some: { classId } },
          },
        }),
      },
      _count: {
        id: true,
      },
    });

    // 7. Task Submission Status
    const taskStats = await prisma.task.findMany({
      where: classWhere,
      include: {
        submissions: {
          select: {
            status: true,
          },
        },
      },
    });

    const taskSubmissions = taskStats.map((task: any) => ({
      taskId: task.id,
      title: task.title,
      total: task.submissions.length,
      pending: task.submissions.filter((s: any) => s.status === 'pending').length,
      approved: task.submissions.filter((s: any) => s.status === 'approved').length,
      rejected: task.submissions.filter((s: any) => s.status === 'rejected').length,
    }));

    return NextResponse.json({
      period: { startDate, endDate },
      engagementMetrics: {
        averageXp: engagementMetrics.length > 0
          ? Math.round(engagementMetrics.reduce((sum: any, m: any) => sum + (m._sum.xpAwarded || 0), 0) / engagementMetrics.length)
          : 0,
        totalXp: engagementMetrics.reduce((sum: any, m: any) => sum + (m._sum.xpAwarded || 0), 0),
        activeStudents: engagementMetrics.length,
      },
      lessonCompletion,
      quizPerformance,
      attendanceData,
      topStudents: topStudents.map((s: any) => ({
        id: s.id,
        name: s.displayName,
        xp: s.totalXp,
        points: s.totalPoints,
        streak: s.currentStreak,
        badges: s.studentBadges.length,
      })),
      badgeDistribution,
      taskSubmissions,
    });
  } catch (error) {
    console.error('GET /api/analytics/dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
