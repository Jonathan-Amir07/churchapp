import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto, userId: string, role: string) {
    if (role !== 'admin' && role !== 'priest') {
      throw new ForbiddenException('Only admins or priests can create events');
    }

    return this.prisma.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date)
      }
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: { date: 'asc' },
      where: { date: { gte: new Date() } } // Only upcoming events
    });
  }
}
