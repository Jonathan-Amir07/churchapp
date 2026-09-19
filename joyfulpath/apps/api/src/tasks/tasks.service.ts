import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SubmitTaskDto } from './dto/submit-task.dto';
import { ReviewTaskDto } from './dto/review-task.dto';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
  ) {}

  private async verifyInstructorClassAccess(classId: string, userId: string) {
    const cls = await this.prisma.class.findUnique({
      where: { id: classId },
      include: { members: true },
    });
    if (!cls) throw new NotFoundException('Class not found');
    const isInstructor =
      cls.createdBy === userId ||
      cls.members.some((m) => m.userId === userId && m.role === 'instructor');
    if (!isInstructor) {
      throw new ForbiddenException(
        'You do not have permission to manage this class',
      );
    }
  }

  async create(createTaskDto: CreateTaskDto, userId: string, role: string) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException(
        'Only instructors or admins can create tasks',
      );
    }

    if (role === 'instructor') {
      await this.verifyInstructorClassAccess(createTaskDto.classId, userId);
    }

    // Auto-create a notification logic could go here
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        createdBy: userId,
        status: createTaskDto.status || 'published',
      },
    });
  }

  async findAllForUser(userId: string, role: string) {
    if (role === 'admin') {
      return this.prisma.task.findMany({
        where: { deletedAt: null },
        orderBy: { dueDate: 'asc' },
        include: {
          lesson: { select: { title: true } },
          submissions: true,
        },
      });
    }

    const classIds = (
      await this.prisma.classMember.findMany({
        where: { userId },
        select: { classId: true },
      })
    ).map((m) => m.classId);

    if (role === 'instructor') {
      const createdClasses = (
        await this.prisma.class.findMany({
          where: { createdBy: userId },
          select: { id: true },
        })
      ).map((c) => c.id);
      classIds.push(...createdClasses);
    }

    let childrenIds: string[] = [];
    if (role === 'parent') {
      const parent = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (parent?.familyId) {
        const children = await this.prisma.user.findMany({
          where: { familyId: parent.familyId, role: 'student' },
        });
        childrenIds = children.map((c) => c.id);
        const childClassMembers = await this.prisma.classMember.findMany({
          where: { userId: { in: childrenIds } },
        });
        classIds.push(...childClassMembers.map((c) => c.classId));
      }
    }

    return this.prisma.task.findMany({
      where: { classId: { in: classIds }, deletedAt: null },
      orderBy: { dueDate: 'asc' },
      include: {
        lesson: { select: { title: true } },
        submissions:
          role === 'student'
            ? { where: { studentId: userId } }
            : role === 'parent'
              ? { where: { studentId: { in: childrenIds } } }
              : true,
      },
    });
  }

  async findAllSubmissions(userId: string, role: string) {
    if (role === 'admin') {
      const submissions = await this.prisma.taskSubmission.findMany({
        orderBy: { submittedAt: 'desc' },
        include: {
          task: { select: { title: true, pointsReward: true } },
          student: { select: { firstName: true, lastName: true } },
        },
      });
      return submissions.map((s) => ({
        id: s.id,
        taskId: s.taskId,
        studentName: `${s.student.firstName} ${s.student.lastName}`,
        taskTitleEn: s.task.title,
        taskTitleAr: s.task.title,
        submissionText: s.content || '',
        submittedAt: s.submittedAt,
        points: s.task.pointsReward || 30,
        status: s.status,
        feedbackEn: s.feedback,
        feedbackAr: s.feedback,
        attachmentUrl: s.attachmentUrl,
      }));
    }

    const classIds = (
      await this.prisma.classMember.findMany({
        where: { userId },
        select: { classId: true },
      })
    ).map((m) => m.classId);

    if (role === 'instructor') {
      const createdClasses = (
        await this.prisma.class.findMany({
          where: { createdBy: userId },
          select: { id: true },
        })
      ).map((c) => c.id);
      classIds.push(...createdClasses);
    }

    const submissions = await this.prisma.taskSubmission.findMany({
      where: { task: { classId: { in: classIds } } },
      orderBy: { submittedAt: 'desc' },
      include: {
        task: { select: { title: true, pointsReward: true } },
        student: { select: { firstName: true, lastName: true } },
      },
    });

    return submissions.map((s) => ({
      id: s.id,
      taskId: s.taskId,
      studentName: `${s.student.firstName} ${s.student.lastName}`,
      taskTitleEn: s.task.title,
      taskTitleAr: s.task.title,
      submissionText: s.content || '',
      submittedAt: s.submittedAt,
      points: s.task.pointsReward || 30,
      status: s.status,
      feedbackEn: s.feedback,
      feedbackAr: s.feedback,
      attachmentUrl: s.attachmentUrl,
    }));
  }

  async findAllForClass(classId: string, userId: string, role: string) {
    let childrenIds: string[] = [];
    if (role === 'student' || role === 'parent') {
      if (role === 'student') {
        const membership = await this.prisma.classMember.findUnique({
          where: { classId_userId: { classId, userId } },
        });
        if (!membership) {
          throw new ForbiddenException('You are not a member of this class');
        }
      } else if (role === 'parent') {
        const parent = await this.prisma.user.findUnique({
          where: { id: userId },
        });
        if (parent?.familyId) {
          const children = await this.prisma.user.findMany({
            where: { familyId: parent.familyId, role: 'student' },
          });
          childrenIds = children.map((c) => c.id);
          const childMemberships = await this.prisma.classMember.findMany({
            where: { classId, userId: { in: childrenIds } },
          });
          if (childMemberships.length === 0) {
            throw new ForbiddenException(
              'Your children are not members of this class',
            );
          }
        } else {
          throw new ForbiddenException('No family associated');
        }
      }
    } else if (role === 'instructor') {
      await this.verifyInstructorClassAccess(classId, userId);
    }

    return this.prisma.task.findMany({
      where: { classId, deletedAt: null },
      orderBy: { dueDate: 'asc' },
      include: {
        lesson: { select: { title: true } },
        submissions:
          role === 'student'
            ? { where: { studentId: userId } }
            : role === 'parent'
              ? { where: { studentId: { in: childrenIds } } }
              : true,
      },
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { class: true },
    });

    if (!task || task.deletedAt) {
      throw new NotFoundException('Task not found');
    }

    if (role === 'student') {
      const membership = await this.prisma.classMember.findUnique({
        where: { classId_userId: { classId: task.classId, userId } },
      });
      if (!membership) {
        throw new ForbiddenException('You are not a member of this class');
      }
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
    role: string,
  ) {
    if (role === 'student' || role === 'parent') {
      throw new ForbiddenException('Only instructors or admins can edit tasks');
    }

    const task = await this.findOne(id, userId, role);
    if (role === 'instructor') {
      await this.verifyInstructorClassAccess(task.classId, userId);
    }

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: string, userId: string, role: string) {
    if (role === 'student' || role === 'parent') {
      throw new ForbiddenException(
        'Only instructors or admins can delete tasks',
      );
    }

    const task = await this.findOne(id, userId, role);
    if (role === 'instructor') {
      await this.verifyInstructorClassAccess(task.classId, userId);
    }

    return this.prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async submitTask(
    taskId: string,
    submitTaskDto: SubmitTaskDto,
    userId: string,
  ) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    const membership = await this.prisma.classMember.findUnique({
      where: { classId_userId: { classId: task.classId, userId } },
    });
    if (!membership)
      throw new ForbiddenException('You are not a member of this class');

    // Find existing submission
    const existing = await this.prisma.taskSubmission.findFirst({
      where: { taskId, studentId: userId },
    });

    if (existing) {
      return this.prisma.taskSubmission.update({
        where: { id: existing.id },
        data: {
          content: submitTaskDto.content,
          attachmentUrl: submitTaskDto.attachmentUrl,
          status: 'pending',
          submittedAt: new Date(),
          attemptNumber: existing.attemptNumber + 1,
        },
      });
    }

    return this.prisma.taskSubmission.create({
      data: {
        taskId,
        studentId: userId,
        content: submitTaskDto.content,
        attachmentUrl: submitTaskDto.attachmentUrl,
        status: 'pending',
        attemptNumber: 1,
      },
    });
  }

  async reviewSubmission(
    submissionId: string,
    reviewDto: ReviewTaskDto,
    userId: string,
    role: string,
  ) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Only instructors can review tasks');
    }

    const submission = await this.prisma.taskSubmission.findUnique({
      where: { id: submissionId },
      include: { task: true },
    });

    if (!submission) throw new NotFoundException('Submission not found');

    if (role === 'instructor') {
      await this.verifyInstructorClassAccess(submission.task.classId, userId);
    }

    const updatedSubmission = await this.prisma.taskSubmission.update({
      where: { id: submissionId },
      data: {
        status: reviewDto.status,
        feedback: reviewDto.feedback,
        xpAwarded: reviewDto.xpAwarded,
        pointsAwarded: reviewDto.pointsAwarded,
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
    });

    if (reviewDto.status === 'accepted') {
      await this.gamificationService.awardActivity(
        submission.studentId,
        'task',
        submission.id,
        reviewDto.xpAwarded || 0,
        reviewDto.pointsAwarded || 0,
      );
      await this.gamificationService.processXpGain(submission.studentId);
    }

    // Notifications
    const student = await this.prisma.user.findUnique({
      where: { id: submission.studentId },
      include: { family: true },
    });

    if (student) {
      const payload = JSON.stringify({
        title: 'تقييم مهمة',
        message: `تم تقييم مهمة ${submission.task.title} الخاصة بك. الحالة: ${reviewDto.status === 'accepted' ? 'مقبول' : 'مرفوض'}. ${reviewDto.pointsAwarded ? `حصلت على ${reviewDto.pointsAwarded} نقطة!` : ''}`,
        taskId: submission.taskId,
      });

      // Notify student
      await this.prisma.notification.create({
        data: {
          userId: student.id,
          channel: 'in-app',
          type: 'task_reviewed',
          payload,
        },
      });

      // Notify parents
      if (student.family) {
        const parentPayload = JSON.stringify({
          title: 'تقييم مهمة',
          message: `تم تقييم مهمة ${submission.task.title} الخاصة بـ ${student.displayName}.`,
          taskId: submission.taskId,
          studentId: student.id,
        });

        if (student.family.fatherId) {
          await this.prisma.notification.create({
            data: {
              userId: student.family.fatherId,
              channel: 'in-app',
              type: 'task_reviewed',
              payload: parentPayload,
            },
          });
        }
        if (student.family.motherId) {
          await this.prisma.notification.create({
            data: {
              userId: student.family.motherId,
              channel: 'in-app',
              type: 'task_reviewed',
              payload: parentPayload,
            },
          });
        }
      }
    }

    return updatedSubmission;
  }
}
