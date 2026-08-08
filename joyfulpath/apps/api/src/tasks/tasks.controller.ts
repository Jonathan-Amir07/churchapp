import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SubmitTaskDto } from './dto/submit-task.dto';
import { ReviewTaskDto } from './dto/review-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto, req.user.id, req.user.role);
  }

  @Get('class/:classId')
  findAllForClass(@Request() req, @Param('classId') classId: string) {
    return this.tasksService.findAllForClass(classId, req.user.id, req.user.role);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.tasksService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.tasksService.remove(id, req.user.id, req.user.role);
  }

  @Post(':id/submit')
  submitTask(@Request() req, @Param('id') id: string, @Body() submitTaskDto: SubmitTaskDto) {
    return this.tasksService.submitTask(id, submitTaskDto, req.user.id);
  }

  @Patch('submissions/:id/review')
  reviewSubmission(@Request() req, @Param('id') id: string, @Body() reviewTaskDto: ReviewTaskDto) {
    return this.tasksService.reviewSubmission(id, reviewTaskDto, req.user.id, req.user.role);
  }
}
