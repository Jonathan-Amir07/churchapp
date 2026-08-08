import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { AddAttachmentDto } from './dto/add-attachment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('lessons')
@UseGuards(JwtAuthGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  create(@Request() req, @Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto, req.user.id, req.user.role);
  }

  @Get('class/:classId')
  findAllForClass(@Request() req, @Param('classId') classId: string) {
    return this.lessonsService.findAllForClass(classId, req.user.id, req.user.role);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.lessonsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.lessonsService.remove(id, req.user.id, req.user.role);
  }

  @Post(':id/attachments')
  addAttachment(@Request() req, @Param('id') id: string, @Body() addAttachmentDto: AddAttachmentDto) {
    return this.lessonsService.addAttachment(id, addAttachmentDto, req.user.id, req.user.role);
  }
}
