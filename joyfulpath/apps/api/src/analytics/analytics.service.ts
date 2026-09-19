import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getClassOverview(classId: string, userId: string, role: string) {
    if (role === 'student' || role === 'parent') {
      throw new ForbiddenException('Access denied');
    }

    const totalStudents = await this.prisma.classMember.count({
      where: { classId },
    });

    // Calculate average attendance rate efficiently
    const presentCount = await this.prisma.attendance.count({
      where: { classId, status: 'present' },
    });
    const totalAttendance = await this.prisma.attendance.count({
      where: { classId },
    });
    const attendanceRate =
      totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

    // Get recent quiz attempts
    const recentAttempts = await this.prisma.quizAttempt.findMany({
      where: { quiz: { classId } },
      orderBy: { completedAt: 'desc' },
      take: 10,
      include: {
        student: { select: { firstName: true, lastName: true } },
        quiz: { select: { title: true } },
      },
    });

    return {
      totalStudents,
      attendanceRate: Math.round(attendanceRate),
      totalClasses: await this.prisma.lesson.count({ where: { classId } }),
      recentAttempts,
    };
  }

  async getGlobalDashboard(role: string) {
    if (role !== 'admin' && role !== 'priest') {
      throw new ForbiddenException('Access denied');
    }

    const totalStudents = await this.prisma.user.count({
      where: { role: 'student', isActive: true },
    });

    const presentCount = await this.prisma.attendance.count({
      where: { status: 'present' },
    });
    const totalAttendance = await this.prisma.attendance.count();
    const attendanceRate =
      totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

    const totalLessons = await this.prisma.lesson.count({
      where: { deletedAt: null },
    });

    const activeUsers = await this.prisma.user.count({
      where: {
        lastActiveAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)), // Active in last 7 days
        },
      },
    });

    return {
      totalStudents,
      activeUsers,
      attendanceRate: Math.round(attendanceRate),
      totalLessons,
    };
  }
  async getStudentAnalytics(
    studentId: string,
    currentUserId: string,
    role: string,
  ) {
    // 1. Authorization
    let authorized = false;
    if (['admin', 'priest'].includes(role)) {
      authorized = true;
    } else if (role === 'student' && currentUserId === studentId) {
      authorized = true;
    } else if (role === 'parent') {
      const parent = await this.prisma.user.findUnique({
        where: { id: currentUserId },
      });
      const student = await this.prisma.user.findUnique({
        where: { id: studentId },
      });
      if (parent?.familyId && parent.familyId === student?.familyId) {
        authorized = true;
      }
    } else if (role === 'instructor') {
      const classes = await this.prisma.class.findMany({
        where: { createdBy: currentUserId },
      });
      const classIds = classes.map((c) => c.id);
      const isMember = await this.prisma.classMember.findFirst({
        where: { userId: studentId, classId: { in: classIds } },
      });
      if (isMember) authorized = true;
    }

    if (!authorized) {
      throw new ForbiddenException(
        "Access denied to view this student's analytics",
      );
    }

    // 2. Fetch Student Analytics
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      include: {
        currentLevel: true,
      },
    });

    // Attendance
    const presentCount = await this.prisma.attendance.count({
      where: { userId: studentId, status: 'present' },
    });
    const totalAttendance = await this.prisma.attendance.count({
      where: { userId: studentId },
    });
    const attendanceRate =
      totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

    // Task & Quiz Completion
    const completedTasks = await this.prisma.taskSubmission.count({
      where: { studentId: studentId, status: 'approved' }, // or whatever status denotes done
    });
    const quizAttempts = await this.prisma.quizAttempt.findMany({
      where: { studentId: studentId },
      orderBy: { completedAt: 'desc' },
      take: 10,
    });

    // Aggregations
    const avgQuizScore =
      quizAttempts.length > 0
        ? quizAttempts.reduce((acc, curr) => acc + Number(curr.percentage), 0) /
          quizAttempts.length
        : 0;

    const achievementsCount = await this.prisma.studentAchievement.count({
      where: { userId: studentId },
    });

    return {
      overview: {
        totalXp: student?.totalXp || 0,
        totalPoints: student?.totalPoints || 0,
        currentStreak: student?.currentStreak || 0,
        longestStreak: student?.longestStreak || 0,
        level: student?.currentLevel?.title || 'Beginner',
      },
      attendance: {
        present: presentCount,
        absent: totalAttendance - presentCount,
        rate: Math.round(attendanceRate),
      },
      learning: {
        tasksCompleted: completedTasks,
        quizAvgScore: Math.round(avgQuizScore),
        achievementsCount: achievementsCount,
      },
      recentQuizzes: quizAttempts,
    };
  }
}
