import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class ReadingPlansService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
  ) {}

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
      // Use the current date string as part of the sourceId to prevent farming on the same day
      const todayString = new Date().toISOString().split('T')[0];
      await this.gamificationService.awardActivity(
        userId,
        'reading_plan',
        `${planId}_${todayString}`,
        10,
        0,
      );
      await this.gamificationService.processXpGain(userId);
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
