import { Controller, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('games')
@UseGuards(JwtAuthGuard)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('start')
  startSession(@Request() req: any, @Body('gameType') gameType: string) {
    return this.gamesService.startSession(req.user.id, gameType);
  }

  @Post(':sessionId/progress')
  updateProgress(
    @Request() req: any,
    @Param('sessionId') sessionId: string,
    @Body('score') score: number,
    @Body('checkpoint') checkpoint: string,
  ) {
    return this.gamesService.updateProgress(sessionId, req.user.id, score, checkpoint);
  }

  @Post(':sessionId/end')
  endSession(
    @Request() req: any,
    @Param('sessionId') sessionId: string,
    @Body('finalScore') finalScore: number,
  ) {
    return this.gamesService.endSession(sessionId, req.user.id, finalScore);
  }
}
