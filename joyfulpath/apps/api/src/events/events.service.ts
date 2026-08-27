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
        date: new Date(createEventDto.date),
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: { date: 'asc' },
      where: { date: { gte: new Date() } }, // Only upcoming events
    });
  }

  async update(id: string, updateData: any, role: string) {
    if (role !== 'admin' && role !== 'priest' && role !== 'instructor') {
      throw new ForbiddenException('Unauthorized to update events');
    }
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }
    return this.prisma.event.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, role: string) {
    if (role !== 'admin' && role !== 'priest' && role !== 'instructor') {
      throw new ForbiddenException('Unauthorized to delete events');
    }
    return this.prisma.event.delete({ where: { id } });
  }

  async rsvp(eventId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({ where: { id: eventId } });
      if (!event) throw new ForbiddenException('Event not found');

      if (event.currentRsvp >= event.maxCapacity) {
        throw new ForbiddenException('Event is at maximum capacity');
      }

      // We just increment currentRsvp for now, realistically we should have an EventRsvp model to prevent double RSVP.
      // But based on schema, Event has `currentRsvp` and `maxCapacity` only. 
      return tx.event.update({
        where: { id: eventId },
        data: { currentRsvp: { increment: 1 } }
      });
    });
  }
}
