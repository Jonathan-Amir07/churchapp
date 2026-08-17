import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(private prisma: PrismaService) {}

  async processXpGain(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { currentLevel: true }
    });

    if (!user) return;

    // Fetch all levels
    const levels = await this.prisma.level.findMany({
      orderBy: { minXp: 'asc' }
    });

    // Find correct level
    let newLevel = levels[0];
    for (const lvl of levels) {
      if (user.totalXp >= lvl.minXp) {
        newLevel = lvl;
      }
    }

    if (!user.currentLevel || user.currentLevel.levelNumber < newLevel.levelNumber) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { currentLevelId: newLevel.id }
      });
      this.logger.log(`User ${userId} leveled up to Level ${newLevel.levelNumber}!`);
      
      // We would create a Notification here
      await this.prisma.notification.create({
        data: {
          userId,
          channel: 'in-app',
          type: 'gamification',
          payload: JSON.stringify({
            title: 'Level Up!',
            message: `Congratulations! You have reached Level ${newLevel.levelNumber}: ${newLevel.title}`
          })
        }
      });
    }
  }
}
