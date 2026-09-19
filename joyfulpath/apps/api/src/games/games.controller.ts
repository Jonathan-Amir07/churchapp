import {
  Controller,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('games')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Roles('admin', 'instructor', 'priest')
  @Post('start')
  startSession(@Request() req: any, @Body('gameType') gameType: string) {
    return this.gamesService.startSession(req.user.id, gameType);
  }

  @Roles('admin', 'instructor', 'priest')
  @Post(':sessionId/progress')
  updateProgress(
    @Request() req: any,
    @Param('sessionId') sessionId: string,
    @Body('score') score: number,
    @Body('checkpoint') checkpoint: string,
  ) {
    return this.gamesService.updateProgress(
      sessionId,
      req.user.id,
      score,
      checkpoint,
    );
  }

  @Roles('admin', 'instructor', 'priest')
  @Post(':sessionId/end')
  endSession(
    @Request() req: any,
    @Param('sessionId') sessionId: string,
    @Body('finalScore') finalScore: number,
  ) {
    return this.gamesService.endSession(sessionId, req.user.id, finalScore);
  }
}
