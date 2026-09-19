import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SubmitAttemptDto } from './dto/submit-attempt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('quizzes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Roles('admin', 'instructor', 'priest')
  @Post()
  create(@Request() req: any, @Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.createQuiz(
      createQuizDto,
      req.user.userId,
      req.user.role,
    );
  }

  @Roles('admin', 'instructor', 'priest')
  @Post(':id/questions')
  addQuestion(
    @Request() req: any,
    @Param('id') id: string,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return this.quizzesService.addQuestion(
      id,
      createQuestionDto,
      req.user.userId,
      req.user.role,
    );
  }

  @Get()
  findAllForUser(@Request() req: any) {
    return this.quizzesService.findAllForUser(req.user.userId, req.user.role);
  }

  @Get('class/:classId')
  findAllForClass(@Request() req: any, @Param('classId') classId: string) {
    return this.quizzesService.findAllForClass(
      classId,
      req.user.userId,
      req.user.role,
    );
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.quizzesService.findOne(id, req.user.userId, req.user.role);
  }

  @Roles('student', 'admin', 'instructor', 'priest')
  @Post(':id/start')
  startAttempt(@Request() req: any, @Param('id') id: string) {
    return this.quizzesService.startAttempt(id, req.user.userId);
  }

  @Roles('student', 'admin', 'instructor', 'priest')
  @Post('attempts/:attemptId/submit')
  submitAttempt(
    @Request() req: any,
    @Param('attemptId') attemptId: string,
    @Body() submitDto: SubmitAttemptDto,
  ) {
    return this.quizzesService.submitAttempt(
      attemptId,
      submitDto,
      req.user.userId,
    );
  }
}
