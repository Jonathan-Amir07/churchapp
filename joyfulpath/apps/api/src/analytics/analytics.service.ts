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
    const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

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
    const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

    const totalLessons = await this.prisma.lesson.count({
      where: { deletedAt: null }
    });

    const activeUsers = await this.prisma.user.count({
      where: {
        lastActiveAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)) // Active in last 7 days
        }
      }
    });

    return {
      totalStudents,
      activeUsers,
      attendanceRate: Math.round(attendanceRate),
      totalLessons,
    };
  }
}
