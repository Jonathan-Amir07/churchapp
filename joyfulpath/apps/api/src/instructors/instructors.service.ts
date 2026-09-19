import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InstructorsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(instructorId: string) {
    // Get all classes created by this instructor
    const classes = await this.prisma.class.findMany({
      where: { createdBy: instructorId },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    const classIds = classes.map((c) => c.id);

    // Total assigned students
    const totalStudentsResult = await this.prisma.classMember.aggregate({
      where: { classId: { in: classIds }, role: 'student' },
      _count: { userId: true },
    });
    const totalStudents = totalStudentsResult._count.userId;

    // Pending Grading (task submissions with status 'pending' in tasks created by this instructor)
    const pendingGradingResult = await this.prisma.taskSubmission.aggregate({
      where: {
        status: 'pending',
        task: { createdBy: instructorId },
      },
      _count: { id: true },
    });
    const pendingGrading = pendingGradingResult._count.id;

    // Recent Activity (Activity logs of students in their classes)
    const recentActivity = await this.prisma.activityLog.findMany({
      where: {
        user: {
          classMembers: { some: { classId: { in: classIds } } },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      classes,
      totalStudents,
      pendingGrading,
      recentActivity,
    };
  }
}
