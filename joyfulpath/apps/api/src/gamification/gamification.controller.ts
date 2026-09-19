import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GamificationService } from './gamification.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('gamification')
@UseGuards(JwtAuthGuard, RolesGuard)
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
  async getClassLeaderboard(
    @Param('classId') classId: string,
    @Request() req: any,
  ) {
    if (req.user.role === 'student' || req.user.role === 'parent') {
      const isMember = await this.prisma.classMember.findFirst({
        where: { classId, userId: req.user.userId },
      });
      if (!isMember) {
        throw new ForbiddenException(
          'Not authorized to view this class leaderboard',
        );
      }
    } else if (req.user.role === 'instructor') {
      const cls = await this.prisma.class.findUnique({
        where: { id: classId },
        include: { members: true },
      });
      if (
        !cls ||
        (cls.createdBy !== req.user.userId &&
          !cls.members.some(
            (m) => m.userId === req.user.userId && m.role === 'instructor',
          ))
      ) {
        throw new ForbiddenException(
          'Not authorized to view this class leaderboard',
        );
      }
    }

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
