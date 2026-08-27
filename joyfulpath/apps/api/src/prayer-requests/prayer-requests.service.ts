import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePrayerRequestDto,
  UpdatePrayerRequestDto,
} from './dto/prayer-request.dto';

@Injectable()
export class PrayerRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePrayerRequestDto, userId: string) {
    return this.prisma.prayerRequest.create({
      data: {
        studentId: userId,
        type: dto.type,
        title: dto.title,
        body: dto.body,
        isPrivate: dto.isPrivate || false,
      },
    });
  }

  async update(
    id: string,
    dto: UpdatePrayerRequestDto,
    userId: string,
    role: string,
  ) {
    const request = await this.prisma.prayerRequest.findUnique({
      where: { id },
    });
    if (!request) throw new NotFoundException('Prayer request not found');

    if (role === 'student' && request.studentId !== userId) {
      throw new ForbiddenException(
        'You can only update your own prayer requests',
      );
    }

    if (dto.response && (role === 'priest' || role === 'instructor')) {
      await this.prisma.prayerResponse.create({
        data: {
          prayerRequestId: id,
          responderId: userId,
          message: dto.response,
        },
      });
    }

    return this.prisma.prayerRequest.update({
      where: { id },
      data: {
        isAddressed:
          dto.isAddressed !== undefined ? dto.isAddressed : request.isAddressed,
      },
    });
  }

  async findAll(userId: string, role: string) {
    if (role === 'student' || role === 'parent') {
      return this.prisma.prayerRequest.findMany({
        where: { OR: [{ studentId: userId }, { isPrivate: false }] },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Instructors/Priests/Admins see all
      return this.prisma.prayerRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          student: { select: { id: true, firstName: true, lastName: true } },
        },
      });
    }
  }
}
