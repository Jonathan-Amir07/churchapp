import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QrGenerateDto, QrScanDto } from './dto/qr.dto';
import { ManualAttendanceDto } from './dto/manual-attendance.dto';

import { GamificationService } from '../gamification/gamification.service';

// In a real application, you'd use a Redis cache or signed JWTs for QR tokens.
// For this prototype, we'll store active QR tokens in memory.
const activeQrTokens = new Map<
  string,
  { classId: string; expiresAt: number }
>();

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
  ) {}

  async generateQr(dto: QrGenerateDto, userId: string, role: string) {
    if (role !== 'instructor' && role !== 'admin' && role !== 'priest') {
      throw new ForbiddenException(
        'Only instructors or admins can generate QR codes',
      );
    }

    if (role === 'instructor') {
      await this.verifyInstructorClassAccess(dto.classId, userId, role);
    }

    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes valid
    activeQrTokens.set(token, { classId: dto.classId, expiresAt });

    return { token, expiresAt };
  }

  private async verifyInstructorClassAccess(
    classId: string,
    userId: string,
    role: string,
  ) {
    const classRecord = await this.prisma.class.findUnique({
      where: { id: classId },
      include: { members: true },
    });
    if (!classRecord) {
      throw new NotFoundException('Class not found');
    }
    const isInstructor =
      classRecord.createdBy === userId ||
      classRecord.members.some(
        (m) => m.userId === userId && m.role === 'instructor',
      );
    // Admins and Priests have implicit access to all classes
    if (!isInstructor && role !== 'admin' && role !== 'priest') {
      throw new ForbiddenException('You do not own this class');
    }
  }

  async scanQr(dto: QrScanDto, userId: string) {
    const session = activeQrTokens.get(dto.token);
    if (!session) {
      throw new BadRequestException('Invalid or expired QR code');
    }
    if (Date.now() > session.expiresAt) {
      activeQrTokens.delete(dto.token);
      throw new BadRequestException('QR code has expired');
    }

    const membership = await this.prisma.classMember.findUnique({
      where: { classId_userId: { classId: session.classId, userId } },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this class');
    }

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    const existing = await this.prisma.attendance.findFirst({
      where: {
        classId: session.classId,
        userId: userId,
        date: { gte: startOfDay, lt: endOfDay },
      },
    });

    if (existing) {
      return {
        message: 'Attendance already recorded for today',
        record: existing,
      };
    }

    const record = await this.prisma.attendance.create({
      data: {
        classId: session.classId,
        userId: userId,
        date: new Date(),
        status: 'present',
        xpAwarded: 20,
        recordedBy: userId,
      },
    });

    await this.gamificationService.awardActivity(
      userId,
      'attendance',
      record.id,
      20,
      0,
    );
    await this.gamificationService.processXpGain(userId);

    return { message: 'Attendance recorded successfully. +20 XP!', record };
  }

  async submitManual(dto: ManualAttendanceDto, userId: string, role: string) {
    if (role !== 'instructor' && role !== 'admin' && role !== 'priest') {
      throw new ForbiddenException('Access denied to submit attendance');
    }

    if (role === 'instructor') {
      await this.verifyInstructorClassAccess(dto.classId, userId, role);
    }

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    const records = await this.prisma.$transaction(async (tx) => {
      const results = [];
      for (const r of dto.records) {
        // Prevent duplicate attendance for the same day
        const existing = await tx.attendance.findFirst({
          where: {
            classId: dto.classId,
            userId: r.studentId,
            date: { gte: startOfDay, lt: endOfDay },
          },
        });

        if (existing) {
          // If already marked, skip or optionally update. Here we just skip to prevent dupes.
          continue;
        }

        const points = r.status === 'present' ? 20 : 0;

        const newRecord = await tx.attendance.create({
          data: {
            classId: dto.classId,
            userId: r.studentId,
            date: new Date(),
            status: r.status,
            xpAwarded: points,
            recordedBy: userId,
          },
        });
        results.push(newRecord);

        // Notify parents if absent
        if (r.status === 'absent') {
          const student = await tx.user.findUnique({
            where: { id: r.studentId },
            include: { family: true },
          });
          const classRecord = await tx.class.findUnique({
            where: { id: dto.classId },
          });

          if (student?.family) {
            const payload = JSON.stringify({
              title: 'إشعار غياب',
              message: `تغيب ${student.displayName} عن درس ${classRecord?.name || 'مدارس الأحد'} اليوم.`,
              studentId: r.studentId,
              classId: dto.classId,
            });

            if (student.family.fatherId) {
              await tx.notification.create({
                data: {
                  userId: student.family.fatherId,
                  channel: 'in-app',
                  type: 'absence',
                  payload,
                },
              });
            }
            if (student.family.motherId) {
              await tx.notification.create({
                data: {
                  userId: student.family.motherId,
                  channel: 'in-app',
                  type: 'absence',
                  payload,
                },
              });
            }
          }
        }
      }
      return results;
    });

    // Process gamification idempotently after transaction
    for (const record of records) {
      if (record.xpAwarded > 0) {
        await this.gamificationService.awardActivity(
          record.userId,
          'attendance',
          record.id,
          record.xpAwarded,
          0,
        );
        await this.gamificationService.processXpGain(record.userId);
      }
    }

    return { message: 'Attendance submitted successfully', records };
  }

  async getStudentAttendancePercentage(
    studentId: string,
    classId: string,
    userId: string,
    role: string,
  ) {
    if (role === 'student' && studentId !== userId) {
      throw new ForbiddenException('You can only view your own attendance');
    }
    if (role === 'parent') {
      const parentChild = await this.prisma.family.findFirst({
        where: {
          OR: [{ fatherId: userId }, { motherId: userId }],
          children: { some: { id: studentId } },
        },
      });
      if (!parentChild) {
        throw new ForbiddenException('You can only view your own children');
      }
    }

    const totalSessions = await this.prisma.attendance.groupBy({
      by: ['date'],
      where: { classId },
    });

    const attendedSessions = await this.prisma.attendance.count({
      where: { classId, userId: studentId, status: 'present' },
    });

    const total = totalSessions.length;
    const percentage = total > 0 ? (attendedSessions / total) * 100 : 0;

    return {
      attended: attendedSessions,
      total,
      percentage: Math.round(percentage),
    };
  }

  async getReports(classId: string, userId: string, role: string) {
    if (role !== 'instructor' && role !== 'admin' && role !== 'priest') {
      throw new ForbiddenException('Access denied');
    }

    if (role === 'instructor') {
      await this.verifyInstructorClassAccess(classId, userId, role);
    }

    return this.prisma.attendance.findMany({
      where: { classId },
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { date: 'desc' },
    });
  }
}
