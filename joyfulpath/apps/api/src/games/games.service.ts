import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class GamesService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
  ) {}

  async startSession(userId: string, gameType: string) {
    const session = await this.prisma.gameSession.create({
      data: {
        gameType,
        hostUserId: userId,
        startedAt: new Date(),
        status: 'active',
        state: '{}',
      }
    });

    const progress = await this.prisma.gameProgress.create({
      data: {
        sessionId: session.id,
        userId,
        checkpoint: '{}',
        score: 0,
      }
    });

    return { session, progress };
  }

  async updateProgress(sessionId: string, userId: string, score: number, checkpoint: string) {
    const progress = await this.prisma.gameProgress.findFirst({
      where: { sessionId, userId }
    });

    if (!progress) throw new NotFoundException('Game progress not found');

    // Basic server-side validation logic
    if (score < 0 || score > 10000) {
      throw new BadRequestException('Invalid score reported');
    }

    return this.prisma.gameProgress.update({
      where: { id: progress.id },
      data: { score, checkpoint }
    });
  }

  async endSession(sessionId: string, userId: string, finalScore: number) {
    const session = await this.prisma.gameSession.findUnique({
      where: { id: sessionId }
    });
    
    if (!session || session.status !== 'active') {
      throw new NotFoundException('Active game session not found');
    }

    const progress = await this.updateProgress(sessionId, userId, finalScore, '{}');

    await this.prisma.gameSession.update({
      where: { id: sessionId },
      data: { status: 'completed', endedAt: new Date(), score: finalScore }
    });

    // Award XP based on final score idempotently tied to the session
    const xpAwarded = Math.floor(finalScore / 10);
    const pointsAwarded = Math.floor(finalScore / 50);

    await this.gamificationService.awardActivity(
      userId,
      'game_session',
      sessionId,
      xpAwarded,
      pointsAwarded,
    );
    await this.gamificationService.processXpGain(userId);

    return { session, progress, xpAwarded, pointsAwarded };
  }
}
