import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QrGenerateDto, QrScanDto } from './dto/qr.dto';
import { ManualAttendanceDto } from './dto/manual-attendance.dto';

// In a real application, you'd use a Redis cache or signed JWTs for QR tokens.
// For this prototype, we'll store active QR tokens in memory.
const activeQrTokens = new Map<string, { classId: string, expiresAt: number }>();

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async generateQr(dto: QrGenerateDto, userId: string, role: string) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Only instructors can generate QR codes');
    }

    if (role === 'instructor') {
      const classRecord = await this.prisma.class.findUnique({ where: { id: dto.classId } });
      if (!classRecord || classRecord.createdBy !== userId) {
        throw new ForbiddenException('You do not own this class');
      }
    }

    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes valid
    activeQrTokens.set(token, { classId: dto.classId, expiresAt });

    return { token, expiresAt };
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
      where: { classId_userId: { classId: session.classId, userId } }
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this class');
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.attendance.findFirst({
      where: {
        classId: session.classId,
        studentId: userId,
        date: { gte: today }
      }
    });

    if (existing) {
      return { message: 'Attendance already recorded for today', record: existing };
    }

    // Award 20 XP for attending
    await this.prisma.user.update({
      where: { id: userId },
      data: { totalXp: { increment: 20 } }
    });

    const record = await this.prisma.attendance.create({
      data: {
        classId: session.classId,
        studentId: userId,
        date: new Date(),
        status: 'present',
        pointsAwarded: 20
      }
    });

    return { message: 'Attendance recorded successfully. +20 XP!', record };
  }

  async submitManual(dto: ManualAttendanceDto, userId: string, role: string) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Only instructors can submit attendance');
    }

    if (role === 'instructor') {
      const classRecord = await this.prisma.class.findUnique({ where: { id: dto.classId } });
      if (!classRecord || classRecord.createdBy !== userId) {
        throw new ForbiddenException('You do not own this class');
      }
    }

    const today = new Date();
    const records = await Promise.all(
      dto.records.map(async (r) => {
        const points = r.status === 'present' ? 20 : 0;
        if (points > 0) {
          await this.prisma.user.update({
            where: { id: r.studentId },
            data: { totalXp: { increment: points } }
          });
        }
        return this.prisma.attendance.create({
          data: {
            classId: dto.classId,
            studentId: r.studentId,
            date: today,
            status: r.status,
            pointsAwarded: points
          }
        });
      })
    );

    return { message: 'Attendance submitted successfully', records };
  }

  async getReports(classId: string, userId: string, role: string) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Access denied');
    }

    if (role === 'instructor') {
      const classRecord = await this.prisma.class.findUnique({ where: { id: classId } });
      if (!classRecord || classRecord.createdBy !== userId) {
        throw new ForbiddenException('You do not own this class');
      }
    }

    return this.prisma.attendance.findMany({
      where: { classId },
      include: { student: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { date: 'desc' }
    });
  }
}
