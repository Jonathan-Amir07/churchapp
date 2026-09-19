/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Prisma } from '@joyfulpath/database';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Roles('admin', 'instructor')
  @Post()
  create(@Req() req: any, @Body() data: any) {
    data.createdBy = req.user.userId;
    return this.classesService.create(data);
  }

  @Get()
  findAll(@Req() req: any, @Query() query: any) {
    return this.classesService.findAll(query, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.classesService.findOne(id, req.user);
  }

  @Roles('admin', 'instructor')
  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() data: Prisma.ClassUpdateInput,
  ) {
    return this.classesService.update(id, data, req.user);
  }

  @Roles('admin', 'instructor')
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.classesService.remove(id, req.user);
  }

  @Roles('admin', 'instructor')
  @Post(':id/students/:studentId')
  addStudent(
    @Req() req: any,
    @Param('id') classId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.classesService.addStudent(classId, studentId, req.user);
  }

  @Roles('admin', 'instructor')
  @Delete(':id/students/:studentId')
  removeStudent(
    @Req() req: any,
    @Param('id') classId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.classesService.removeStudent(classId, studentId, req.user);
  }
}
