import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ReadingPlansService {
  constructor(private prisma: PrismaService) {}

  async getActivePlan() {
    // Return the first available reading plan for demo purposes
    const plan = await this.prisma.readingPlan.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!plan) {
      // Auto-create a mock plan if none exists to ensure frontend doesn't break
      return this.prisma.readingPlan.create({
        data: {
          title: '365 Days in the Bible',
          description: 'A comprehensive journey through the scriptures.',
          durationDays: 365,
          content: JSON.stringify([
            { day: 1, verse: 'Genesis 1:1-31' },
            { day: 2, verse: 'Genesis 2:1-25' },
          ]),
        },
      });
    }

    return plan;
  }

  async getProgress(planId: string, userId: string) {
    const progress = await this.prisma.readingPlanProgress.findUnique({
      where: { userId_planId: { userId, planId } },
    });

    if (!progress) {
      return this.prisma.readingPlanProgress.create({
        data: {
          userId,
          planId,
          progress: '{}',
          streak: 0,
        },
      });
    }

    return progress;
  }

  async updateProgress(
    planId: string,
    updateProgressDto: UpdateProgressDto,
    userId: string,
  ) {
    let progress = await this.prisma.readingPlanProgress.findUnique({
      where: { userId_planId: { userId, planId } },
    });

    if (!progress) {
      progress = await this.prisma.readingPlanProgress.create({
        data: { userId, planId, progress: '{}', streak: 0 },
      });
    }

    // Award XP if completed today
    if (updateProgressDto.completedToday) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          totalXp: { increment: 10 },
          currentStreak: { increment: 1 },
        },
      });
    }

    return this.prisma.readingPlanProgress.update({
      where: { id: progress.id },
      data: {
        progress: updateProgressDto.progress,
        streak: updateProgressDto.completedToday
          ? progress.streak + 1
          : progress.streak,
      },
    });
  }
}
