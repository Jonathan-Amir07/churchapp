import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@joyfulpath/database';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ClassUncheckedCreateInput) {
    return this.prisma.class.create({ data });
  }

  async findAll(query: any, user: any) {
    const where: Prisma.ClassWhereInput = {};
    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }
    
    // Admins see all classes. Instructors only see classes they created or are assigned to.
    if (user.role === 'instructor') {
      where.OR = [
        { createdBy: user.userId },
        { members: { some: { userId: user.userId, role: 'instructor' } } }
      ];
    } else if (user.role === 'student' || user.role === 'parent') {
      where.members = { some: { userId: user.userId } };
    }

    return this.prisma.class.findMany({
      where,
      include: {
        members: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
        _count: { select: { members: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const cls = await this.prisma.class.findUnique({
      where: { id },
      include: {
        members: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, username: true } } } },
      }
    });
    if (!cls) throw new NotFoundException('Class not found');
    return cls;
  }

  async update(id: string, data: Prisma.ClassUncheckedUpdateInput, user: any) {
    const cls = await this.prisma.class.findUnique({ where: { id } });
    if (!cls) throw new NotFoundException('Class not found');
    if (user.role === 'instructor' && cls.createdBy !== user.userId) {
      throw new ForbiddenException('Not authorized to edit this class');
    }
    return this.prisma.class.update({ where: { id }, data });
  }

  async remove(id: string, user: any) {
    const cls = await this.prisma.class.findUnique({ where: { id } });
    if (!cls) throw new NotFoundException('Class not found');
    if (user.role === 'instructor' && cls.createdBy !== user.userId) {
      throw new ForbiddenException('Not authorized to delete this class');
    }
    return this.prisma.class.delete({ where: { id } });
  }

  async addStudent(classId: string, studentId: string) {
    return this.prisma.classMember.create({
      data: { classId, userId: studentId, role: 'student' }
    });
  }

  async removeStudent(classId: string, studentId: string) {
    return this.prisma.classMember.delete({
      where: { classId_userId: { classId, userId: studentId } }
    });
  }
}
