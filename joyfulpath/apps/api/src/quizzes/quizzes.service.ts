import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SubmitAttemptDto } from './dto/submit-attempt.dto';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async createQuiz(createQuizDto: CreateQuizDto, userId: string, role: string) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Only instructors or admins can create quizzes');
    }

    if (role === 'instructor') {
      const classRecord = await this.prisma.class.findUnique({
        where: { id: createQuizDto.classId }
      });
      if (!classRecord || classRecord.createdBy !== userId) {
        throw new ForbiddenException('You can only create quizzes for your own classes');
      }
    }

    return this.prisma.quiz.create({
      data: {
        ...createQuizDto,
        createdBy: userId,
      }
    });
  }

  async addQuestion(quizId: string, createQuestionDto: CreateQuestionDto, userId: string, role: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException('Quiz not found');

    if (role === 'instructor' && quiz.createdBy !== userId) {
      throw new ForbiddenException('You can only modify your own quizzes');
    }

    return this.prisma.question.create({
      data: {
        quizId,
        questionType: createQuestionDto.questionType,
        questionText: createQuestionDto.questionText,
        pointsValue: createQuestionDto.pointsValue,
        explanation: createQuestionDto.explanation,
        answers: {
          create: createQuestionDto.answers?.map(ans => ({
            answerText: ans.answerText,
            isCorrect: ans.isCorrect || false
          })) || []
        }
      },
      include: { answers: true }
    });
  }

  async findAllForClass(classId: string, userId: string, role: string) {
    if (role === 'student') {
      const membership = await this.prisma.classMember.findUnique({
        where: { classId_userId: { classId, userId } }
      });
      if (!membership) throw new ForbiddenException('You are not a member of this class');
    } else if (role === 'instructor') {
      const classRecord = await this.prisma.class.findUnique({ where: { id: classId } });
      if (!classRecord || classRecord.createdBy !== userId) {
        throw new ForbiddenException('You do not own this class');
      }
    }

    return this.prisma.quiz.findMany({
      where: { classId, deletedAt: null },
      include: {
        questions: { include: { answers: true } },
        attempts: role === 'student' ? { where: { studentId: userId } } : true
      }
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id, deletedAt: null },
      include: {
        questions: { include: { answers: true } }
      }
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async startAttempt(quizId: string, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { attempts: { where: { studentId: userId } } }
    });

    if (!quiz) throw new NotFoundException('Quiz not found');
    if (quiz.attempts.length >= quiz.maxAttempts) {
      throw new BadRequestException('Maximum attempts reached');
    }

    return this.prisma.quizAttempt.create({
      data: {
        quizId,
        studentId: userId,
        score: 0,
        totalPossible: 0,
        percentage: 0,
        passed: false,
        answersSnapshot: '{}',
        attemptNumber: quiz.attempts.length + 1,
        startedAt: new Date(),
        completedAt: new Date() // Temp value, will be updated on submit
      }
    });
  }

  async submitAttempt(attemptId: string, submitDto: SubmitAttemptDto, userId: string) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: { quiz: { include: { questions: { include: { answers: true } } } } }
    });

    if (!attempt || attempt.studentId !== userId) {
      throw new NotFoundException('Attempt not found');
    }

    let score = 0;
    let totalPossible = 0;
    const { questions } = attempt.quiz;

    questions.forEach(question => {
      totalPossible += question.pointsValue;
      const studentAnswer = submitDto.answers.find(a => a.questionId === question.id);
      
      if (studentAnswer && question.questionType !== 'SHORT') {
        const correctAns = question.answers.find(a => a.isCorrect);
        if (correctAns && correctAns.id === studentAnswer.answer) {
          score += question.pointsValue;
        }
      }
    });

    const percentage = totalPossible > 0 ? (score / totalPossible) * 100 : 0;
    const passed = percentage >= attempt.quiz.passingScore;
    
    // Scale XP and Points based on percentage
    const xpAwarded = Math.round((percentage / 100) * attempt.quiz.xpReward);
    const pointsAwarded = Math.round((percentage / 100) * attempt.quiz.pointsReward);

    return this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        score,
        totalPossible,
        percentage,
        passed,
        answersSnapshot: JSON.stringify(submitDto.answers),
        xpAwarded,
        pointsAwarded,
        completedAt: new Date()
      }
    });
  }
}
