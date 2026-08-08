import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SubmitAttemptDto } from './dto/submit-attempt.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quizzes')
@UseGuards(JwtAuthGuard)
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  create(@Request() req, @Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.createQuiz(createQuizDto, req.user.id, req.user.role);
  }

  @Post(':id/questions')
  addQuestion(@Request() req, @Param('id') id: string, @Body() createQuestionDto: CreateQuestionDto) {
    return this.quizzesService.addQuestion(id, createQuestionDto, req.user.id, req.user.role);
  }

  @Get('class/:classId')
  findAllForClass(@Request() req, @Param('classId') classId: string) {
    return this.quizzesService.findAllForClass(classId, req.user.id, req.user.role);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.quizzesService.findOne(id, req.user.id, req.user.role);
  }

  @Post(':id/start')
  startAttempt(@Request() req, @Param('id') id: string) {
    return this.quizzesService.startAttempt(id, req.user.id);
  }

  @Post('attempts/:attemptId/submit')
  submitAttempt(@Request() req, @Param('attemptId') attemptId: string, @Body() submitDto: SubmitAttemptDto) {
    return this.quizzesService.submitAttempt(attemptId, submitDto, req.user.id);
  }
}
