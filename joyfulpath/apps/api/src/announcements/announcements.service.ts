import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAnnouncementDto, userId: string, role: string) {
    if (role !== 'admin' && role !== 'priest' && role !== 'instructor') {
      throw new ForbiddenException('You cannot create announcements');
    }

    if (role === 'instructor' && !dto.classId) {
      throw new ForbiddenException(
        'Instructors can only announce to their classes',
      );
    }

    const announcement = await this.prisma.announcement.create({
      data: {
        ...dto,
        authorId: userId,
      },
    });

    // In a real system, you would push to a message queue here to notify users.
    // For now we just create the announcement.
    return announcement;
  }

  async findAll(classId?: string) {
    const whereClause: any = {};
    if (classId) {
      whereClause.OR = [{ classId }, { classId: null }];
    } else {
      whereClause.classId = null;
    }

    return this.prisma.announcement.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { firstName: true, lastName: true, role: true } },
      },
    });
  }
}
