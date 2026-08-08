import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private prisma: PrismaService) {}

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
            level: true,
            avatarUrl: true
          }
        }
      }
    });

    return members
      .map(m => m.user)
      .sort((a, b) => b.totalXp - a.totalXp);
  }
}
