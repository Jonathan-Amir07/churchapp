import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getClassOverview(classId: string, userId: string, role: string) {
    if (role === 'student' || role === 'parent') {
      throw new ForbiddenException('Access denied');
    }

    const totalStudents = await this.prisma.classMember.count({ where: { classId } });
    
    // Calculate average attendance rate
    const attendanceRecords = await this.prisma.attendance.findMany({ where: { classId } });
    const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
    const attendanceRate = attendanceRecords.length > 0 ? (presentCount / attendanceRecords.length) * 100 : 0;

    // Get recent quiz attempts
    const recentAttempts = await this.prisma.quizAttempt.findMany({
      where: { quiz: { classId } },
      orderBy: { completedAt: 'desc' },
      take: 10,
      include: { student: { select: { firstName: true, lastName: true } }, quiz: { select: { title: true } } }
    });

    return {
      totalStudents,
      attendanceRate: Math.round(attendanceRate),
      totalClasses: await this.prisma.lesson.count({ where: { classId } }),
      recentAttempts
    };
  }
}
