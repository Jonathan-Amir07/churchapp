import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(private prisma: PrismaService) {}

  async processXpGain(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { currentLevel: true },
    });

    if (!user) return;

    // Fetch all levels
    const levels = await this.prisma.level.findMany({
      orderBy: { minXp: 'asc' },
    });

    // Find correct level
    let newLevel = levels[0];
    for (const lvl of levels) {
      if (user.totalXp >= lvl.minXp) {
        newLevel = lvl;
      }
    }

    if (
      !user.currentLevel ||
      user.currentLevel.levelNumber < newLevel.levelNumber
    ) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { currentLevelId: newLevel.id },
      });
      this.logger.log(
        `User ${userId} leveled up to Level ${newLevel.levelNumber}!`,
      );

      await this.prisma.notification.create({
        data: {
          userId,
          channel: 'in-app',
          type: 'gamification',
          payload: JSON.stringify({
            title: 'Level Up!',
            message: `Congratulations! You have reached Level ${newLevel.levelNumber}: ${newLevel.title}`,
          }),
        },
      });
    }
  }

  async awardActivity(
    userId: string,
    source: string,
    sourceId: string,
    xpAwarded: number,
    pointsAwarded: number,
  ) {
    if (xpAwarded <= 0 && pointsAwarded <= 0) return;

    return this.prisma.$transaction(async (tx) => {
      // Find if we already awarded XP for this exact source+sourceId
      const existingEntry = await tx.xpEntry.findFirst({
        where: { userId, source, sourceId },
      });

      let netXpToAward = xpAwarded;
      let netPointsToAward = pointsAwarded;

      if (existingEntry) {
        // Idempotent: If it's a quiz, maybe they got a higher score.
        // We only award the difference if the new XP is higher.
        if (xpAwarded > existingEntry.xpAmount) {
          netXpToAward = xpAwarded - existingEntry.xpAmount;
          // For points, we'll assume a similar ratio or just skip differential points if we don't track points strictly per entry.
          // Since XpEntry doesn't track points, we'll just award the difference in XP and no additional points to prevent double-dipping complex math, 
          // or we can update XpEntry to also store points. But XpEntry schema only has xpAmount.
          // Let's just update the XpEntry and grant the diff.
          netPointsToAward = 0; 
          
          await tx.xpEntry.update({
            where: { id: existingEntry.id },
            data: { xpAmount: xpAwarded },
          });
        } else {
          // Already awarded this amount or more, do nothing
          return;
        }
      } else {
        // Create new entry
        await tx.xpEntry.create({
          data: {
            userId,
            source,
            sourceId,
            xpAmount: netXpToAward,
          },
        });
      }

      if (netXpToAward > 0 || netPointsToAward > 0) {
        await tx.user.update({
          where: { id: userId },
          data: {
            totalXp: { increment: netXpToAward },
            totalPoints: { increment: netPointsToAward },
          },
        });

        if (netPointsToAward > 0) {
          await tx.pointsTransaction.create({
            data: {
              userId,
              amount: netPointsToAward,
              type: 'earned',
              source,
              sourceId,
              description: `Earned from ${source}`,
            }
          });
        }
      }
    });

    // Process streak on any valid activity
    await this.processStreak(userId);
    // Check achievements
    await this.checkAndAwardAchievements(userId);
  }

  async processStreak(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const now = new Date();
    const lastActive = user.lastActiveAt;
    
    let newCurrentStreak = user.currentStreak;
    let newLongestStreak = user.longestStreak;

    if (!lastActive) {
      newCurrentStreak = 1;
      newLongestStreak = Math.max(1, user.longestStreak);
    } else {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastActiveDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
      
      const diffTime = Math.abs(today.getTime() - lastActiveDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Continued streak
        newCurrentStreak += 1;
        newLongestStreak = Math.max(newCurrentStreak, user.longestStreak);
      } else if (diffDays > 1) {
        // Broke streak
        newCurrentStreak = 1;
      }
      // If diffDays === 0, same day, no streak change
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActiveAt: now,
      }
    });
  }

  async checkAndAwardAchievements(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    // A real implementation would parse achievement.criteria (JSON) 
    // and compare with user stats (XP, Points, Streaks, etc.)
    // For this engine implementation, we will query all achievements and 
    // mock the evaluation for demonstration, ensuring idempotency.
    
    const achievements = await this.prisma.achievement.findMany();
    
    for (const achievement of achievements) {
      // Evaluate basic criteria dynamically (e.g. min XP)
      let earned = false;
      try {
        const criteria = JSON.parse(achievement.criteria || '{}');
        if (criteria.minXp && user.totalXp >= criteria.minXp) earned = true;
        if (criteria.minStreak && user.currentStreak >= criteria.minStreak) earned = true;
      } catch (e) {
        // Ignore JSON parse errors
      }

      if (earned) {
        // Grant idempotently
        const existing = await this.prisma.studentAchievement.findUnique({
          where: {
            userId_achievementId: {
              userId,
              achievementId: achievement.id,
            }
          }
        });

        if (!existing) {
          await this.prisma.studentAchievement.create({
            data: {
              userId,
              achievementId: achievement.id,
              earnedAt: new Date(),
            }
          });

          await this.prisma.notification.create({
            data: {
              userId,
              channel: 'in-app',
              type: 'achievement',
              payload: JSON.stringify({
                title: 'Achievement Unlocked!',
                message: `You earned the achievement: ${achievement.title}`,
                achievementId: achievement.id
              })
            }
          });
        }
      }
    }
  }

  async getLeaderboard(type: 'xp' | 'points' | 'streak', limit: number = 50) {
    const orderBy = type === 'xp' ? { totalXp: 'desc' } : type === 'points' ? { totalPoints: 'desc' } : { currentStreak: 'desc' };
    
    const users = await this.prisma.user.findMany({
      where: { role: 'student', isActive: true },
      orderBy: orderBy as any,
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        totalXp: true,
        totalPoints: true,
        currentStreak: true,
      }
    });

    return users.map((u, index) => ({
      ...u,
      rank: index + 1,
    }));
  }
}
