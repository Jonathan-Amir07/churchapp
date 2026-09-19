import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SubmitTaskDto } from './dto/submit-task.dto';
import { ReviewTaskDto } from './dto/review-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Roles('admin', 'instructor', 'priest')
  @Post()
  create(@Request() req: any, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(
      createTaskDto,
      req.user.userId,
      req.user.role,
    );
  }

  @Get()
  findAllForUser(@Request() req: any) {
    return this.tasksService.findAllForUser(req.user.userId, req.user.role);
  }

  @Get('submissions')
  findAllSubmissions(@Request() req: any) {
    return this.tasksService.findAllSubmissions(req.user.userId, req.user.role);
  }

  @Get('class/:classId')
  findAllForClass(@Request() req: any, @Param('classId') classId: string) {
    return this.tasksService.findAllForClass(
      classId,
      req.user.userId,
      req.user.role,
    );
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.tasksService.findOne(id, req.user.userId, req.user.role);
  }

  @Roles('admin', 'instructor', 'priest')
  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(
      id,
      updateTaskDto,
      req.user.userId,
      req.user.role,
    );
  }

  @Roles('admin', 'instructor', 'priest')
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.tasksService.remove(id, req.user.userId, req.user.role);
  }

  @Roles('student')
  @Post(':id/submit')
  submitTask(
    @Request() req: any,
    @Param('id') id: string,
    @Body() submitTaskDto: SubmitTaskDto,
  ) {
    return this.tasksService.submitTask(id, submitTaskDto, req.user.userId);
  }

  @Roles('admin', 'instructor', 'priest')
  @Patch('submissions/:id/review')
  reviewSubmission(
    @Request() req: any,
    @Param('id') id: string,
    @Body() reviewTaskDto: ReviewTaskDto,
  ) {
    return this.tasksService.reviewSubmission(
      id,
      reviewTaskDto,
      req.user.userId,
      req.user.role,
    );
  }
}
