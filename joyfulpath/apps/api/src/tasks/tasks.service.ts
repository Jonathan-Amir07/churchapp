import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SubmitTaskDto } from './dto/submit-task.dto';
import { ReviewTaskDto } from './dto/review-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string, role: string) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Only instructors or admins can create tasks');
    }

    if (role === 'instructor') {
      const classRecord = await this.prisma.class.findUnique({
        where: { id: createTaskDto.classId }
      });
      if (!classRecord || classRecord.createdBy !== userId) {
        throw new ForbiddenException('You can only create tasks for your own classes');
      }
    }

    // Auto-create a notification logic could go here
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        createdBy: userId,
        status: createTaskDto.status || 'published',
      }
    });
  }

  async findAllForClass(classId: string, userId: string, role: string) {
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

    return this.prisma.task.findMany({
      where: { classId, deletedAt: null },
      orderBy: { dueDate: 'asc' },
      include: {
        lesson: { select: { title: true } },
        submissions: role === 'student' ? { where: { studentId: userId } } : true,
      }
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { class: true }
    });

    if (!task || task.deletedAt) {
      throw new NotFoundException('Task not found');
    }

    if (role === 'student') {
      const membership = await this.prisma.classMember.findUnique({
        where: { classId_userId: { classId: task.classId, userId } }
      });
      if (!membership) {
        throw new ForbiddenException('You are not a member of this class');
      }
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string, role: string) {
    const task = await this.findOne(id, userId, role);
    if (role === 'instructor' && task.createdBy !== userId) {
      throw new ForbiddenException('You can only edit your own tasks');
    }

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto
    });
  }

  async remove(id: string, userId: string, role: string) {
    const task = await this.findOne(id, userId, role);
    if (role === 'instructor' && task.createdBy !== userId) {
      throw new ForbiddenException('You can only delete your own tasks');
    }

    return this.prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async submitTask(taskId: string, submitTaskDto: SubmitTaskDto, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    const membership = await this.prisma.classMember.findUnique({
      where: { classId_userId: { classId: task.classId, userId } }
    });
    if (!membership) throw new ForbiddenException('You are not a member of this class');

    // Find existing submission
    const existing = await this.prisma.taskSubmission.findFirst({
      where: { taskId, studentId: userId }
    });

    if (existing) {
      return this.prisma.taskSubmission.update({
        where: { id: existing.id },
        data: {
          content: submitTaskDto.content,
          attachmentUrl: submitTaskDto.attachmentUrl,
          status: 'pending',
          submittedAt: new Date(),
          attemptNumber: existing.attemptNumber + 1
        }
      });
    }

    return this.prisma.taskSubmission.create({
      data: {
        taskId,
        studentId: userId,
        content: submitTaskDto.content,
        attachmentUrl: submitTaskDto.attachmentUrl,
        status: 'pending',
        attemptNumber: 1
      }
    });
  }

  async reviewSubmission(submissionId: string, reviewDto: ReviewTaskDto, userId: string, role: string) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Only instructors can review tasks');
    }

    const submission = await this.prisma.taskSubmission.findUnique({
      where: { id: submissionId },
      include: { task: true }
    });

    if (!submission) throw new NotFoundException('Submission not found');

    if (role === 'instructor') {
      const classRecord = await this.prisma.class.findUnique({
        where: { id: submission.task.classId }
      });
      if (!classRecord || classRecord.createdBy !== userId) {
        throw new ForbiddenException('You can only review tasks for your own class');
      }
    }

    return this.prisma.taskSubmission.update({
      where: { id: submissionId },
      data: {
        status: reviewDto.status,
        feedback: reviewDto.feedback,
        xpAwarded: reviewDto.xpAwarded,
        pointsAwarded: reviewDto.pointsAwarded,
        reviewedBy: userId,
        reviewedAt: new Date()
      }
    });
  }
}
