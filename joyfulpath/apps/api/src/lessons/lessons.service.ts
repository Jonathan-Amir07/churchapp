import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { AddAttachmentDto } from './dto/add-attachment.dto';

import { GamificationService } from '../gamification/gamification.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createLessonDto: CreateLessonDto, userId: string, role: string) {
    // Only instructors/admins can create lessons
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException(
        'Only instructors or admins can create lessons',
      );
    }

    // If instructor, verify they own the class
    if (role === 'instructor') {
      const classRecord = await this.prisma.class.findUnique({
        where: { id: createLessonDto.classId },
      });
      if (!classRecord || classRecord.createdBy !== userId) {
        throw new ForbiddenException(
          'You can only create lessons for your own classes',
        );
      }
    }

    const lesson = await this.prisma.lesson.create({
      data: {
        ...createLessonDto,
        createdBy: userId,
        status: createLessonDto.status || 'published',
      },
      include: {
        attachments: true,
      },
    });

    if (lesson.status === 'published') {
      const classMembers = await this.prisma.classMember.findMany({
        where: { classId: lesson.classId },
      });
      for (const member of classMembers) {
        await this.notificationsService.create(
          member.userId,
          'lesson',
          'New Lesson Published',
          `A new lesson "${lesson.title}" has been published in your class!`,
          { lessonId: lesson.id }
        );
      }
    }

    return lesson;
  }

  async findAllForClass(classId: string, userId: string, role: string) {
    // Ensure the user has access to this class's lessons
    if (role === 'student') {
      const membership = await this.prisma.classMember.findUnique({
        where: { classId_userId: { classId, userId } },
      });
      if (!membership) {
        throw new ForbiddenException('You are not a member of this class');
      }
    } else if (role === 'instructor') {
      const classRecord = await this.prisma.class.findUnique({
        where: { id: classId },
      });
      if (!classRecord || classRecord.createdBy !== userId) {
        throw new ForbiddenException('You do not own this class');
      }
    }

    return this.prisma.lesson.findMany({
      where: { classId, deletedAt: null },
      orderBy: { orderIndex: 'asc' },
      include: { attachments: true },
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { attachments: true, class: true },
    });

    if (!lesson || lesson.deletedAt) {
      throw new NotFoundException('Lesson not found');
    }

    if (role === 'student') {
      const membership = await this.prisma.classMember.findUnique({
        where: { classId_userId: { classId: lesson.classId, userId } },
      });
      if (!membership) {
        throw new ForbiddenException('You are not a member of this class');
      }
    }

    return lesson;
  }

  async update(
    id: string,
    updateLessonDto: UpdateLessonDto,
    userId: string,
    role: string,
  ) {
    if (role === 'student' || role === 'parent') {
      throw new ForbiddenException('Only instructors or admins can edit lessons');
    }

    const lesson = await this.findOne(id, userId, role);
    if (role === 'instructor' && lesson.createdBy !== userId) {
      throw new ForbiddenException('You can only edit your own lessons');
    }

    return this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
      include: { attachments: true },
    });
  }

  async remove(id: string, userId: string, role: string) {
    if (role === 'student' || role === 'parent') {
      throw new ForbiddenException('Only instructors or admins can delete lessons');
    }

    const lesson = await this.findOne(id, userId, role);
    if (role === 'instructor' && lesson.createdBy !== userId) {
      throw new ForbiddenException('You can only delete your own lessons');
    }

    return this.prisma.lesson.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async addAttachment(
    lessonId: string,
    addAttachmentDto: AddAttachmentDto,
    userId: string,
    role: string,
  ) {
    if (role === 'student' || role === 'parent') {
      throw new ForbiddenException('Only instructors or admins can add attachments');
    }

    const lesson = await this.findOne(lessonId, userId, role);
    if (role === 'instructor' && lesson.createdBy !== userId) {
      throw new ForbiddenException(
        'You can only add attachments to your own lessons',
      );
    }

    return this.prisma.lessonAttachment.create({
      data: {
        ...addAttachmentDto,
        lessonId,
      },
    });
  }

  async startLesson(id: string, userId: string, role: string) {
    const lesson = await this.findOne(id, userId, role);

    const existingProgress = await this.prisma.lessonProgress.findUnique({
      where: { lessonId_userId: { lessonId: id, userId } },
    });

    if (existingProgress) {
      if (existingProgress.status === 'not_started') {
        return this.prisma.lessonProgress.update({
          where: { id: existingProgress.id },
          data: { status: 'in_progress', startedAt: new Date(), progressPct: 10 },
        });
      }
      return existingProgress;
    }

    return this.prisma.lessonProgress.create({
      data: {
        lessonId: id,
        userId,
        status: 'in_progress',
        startedAt: new Date(),
        progressPct: 10,
      },
    });
  }

  async completeLesson(id: string, userId: string, role: string) {
    const lesson = await this.findOne(id, userId, role);

    let progress = await this.prisma.lessonProgress.findUnique({
      where: { lessonId_userId: { lessonId: id, userId } },
    });

    if (!progress) {
      progress = await this.prisma.lessonProgress.create({
        data: {
          lessonId: id,
          userId,
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
          progressPct: 100,
        },
      });
    } else if (progress.status !== 'completed') {
      progress = await this.prisma.lessonProgress.update({
        where: { id: progress.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          progressPct: 100,
        },
      });
    }

    // Award XP idempotently
    await this.gamificationService.awardActivity(
      userId,
      'lesson',
      id,
      lesson.xpReward,
      lesson.pointsReward,
    );
    await this.gamificationService.processXpGain(userId);

    return progress;
  }
}
