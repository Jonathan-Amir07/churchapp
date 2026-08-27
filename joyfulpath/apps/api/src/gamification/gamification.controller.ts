import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GamificationService } from './gamification.service';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
  ) {}

  @Get('leaderboard/global/:type')
  async getGlobalLeaderboard(@Param('type') type: 'xp' | 'points' | 'streak') {
    return this.gamificationService.getLeaderboard(type);
  }

  @Get('leaderboard/class/:classId')
  async getClassLeaderboard(@Param('classId') classId: string) {
    const members = await this.prisma.classMember.findMany({
      where: { classId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            totalXp: true,
            totalPoints: true,
            currentLevel: true,
            avatarUrl: true,
            currentStreak: true,
          },
        },
      },
    });

    return members.map((m) => m.user).sort((a, b) => b.totalXp - a.totalXp);
  }
}
