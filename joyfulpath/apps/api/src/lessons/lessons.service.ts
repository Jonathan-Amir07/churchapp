import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { AddAttachmentDto } from './dto/add-attachment.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(createLessonDto: CreateLessonDto, userId: string, role: string) {
    // Only instructors/admins can create lessons
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Only instructors or admins can create lessons');
    }

    // If instructor, verify they own the class
    if (role === 'instructor') {
      const classRecord = await this.prisma.class.findUnique({
        where: { id: createLessonDto.classId }
      });
      if (!classRecord || classRecord.createdBy !== userId) {
        throw new ForbiddenException('You can only create lessons for your own classes');
      }
    }

    return this.prisma.lesson.create({
      data: {
        ...createLessonDto,
        createdBy: userId,
        status: createLessonDto.status || 'published',
      },
      include: {
        attachments: true
      }
    });
  }

  async findAllForClass(classId: string, userId: string, role: string) {
    // Ensure the user has access to this class's lessons
    if (role === 'student') {
      const membership = await this.prisma.classMember.findUnique({
        where: { classId_userId: { classId, userId } }
      });
      if (!membership) {
        throw new ForbiddenException('You are not a member of this class');
      }
    } else if (role === 'instructor') {
      const classRecord = await this.prisma.class.findUnique({
        where: { id: classId }
      });
      if (!classRecord || classRecord.createdBy !== userId) {
        throw new ForbiddenException('You do not own this class');
      }
    }

    return this.prisma.lesson.findMany({
      where: { classId, deletedAt: null },
      orderBy: { orderIndex: 'asc' },
      include: { attachments: true }
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { attachments: true, class: true }
    });

    if (!lesson || lesson.deletedAt) {
      throw new NotFoundException('Lesson not found');
    }

    if (role === 'student') {
      const membership = await this.prisma.classMember.findUnique({
        where: { classId_userId: { classId: lesson.classId, userId } }
      });
      if (!membership) {
        throw new ForbiddenException('You are not a member of this class');
      }
    }

    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto, userId: string, role: string) {
    const lesson = await this.findOne(id, userId, role);
    if (role === 'instructor' && lesson.createdBy !== userId) {
      throw new ForbiddenException('You can only edit your own lessons');
    }

    return this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
      include: { attachments: true }
    });
  }

  async remove(id: string, userId: string, role: string) {
    const lesson = await this.findOne(id, userId, role);
    if (role === 'instructor' && lesson.createdBy !== userId) {
      throw new ForbiddenException('You can only delete your own lessons');
    }

    return this.prisma.lesson.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async addAttachment(lessonId: string, addAttachmentDto: AddAttachmentDto, userId: string, role: string) {
    const lesson = await this.findOne(lessonId, userId, role);
    if (role === 'instructor' && lesson.createdBy !== userId) {
      throw new ForbiddenException('You can only add attachments to your own lessons');
    }

    return this.prisma.lessonAttachment.create({
      data: {
        ...addAttachmentDto,
        lessonId
      }
    });
  }
}
