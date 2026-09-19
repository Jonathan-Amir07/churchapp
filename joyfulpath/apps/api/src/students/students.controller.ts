import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  Query,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudentsService } from './students.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Roles('admin', 'priest', 'instructor')
  @Get()
  findAll(
    @Request() req: any,
    @Query('search') search?: string,
    @Query('classId') classId?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.studentsService.findAllStudents({
      search,
      classId,
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      userId: req.user.userId,
      role: req.user.role,
    });
  }

  @Roles('admin', 'priest')
  @Post()
  create(@Body() body: any, @Request() req: any) {
    return this.studentsService.createStudent(body, req.user);
  }

  @Roles('admin', 'priest')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.studentsService.updateStudent(id, body, req.user);
  }

  @Roles('admin', 'priest')
  @Post('import/preview')
  @UseInterceptors(FileInterceptor('file'))
  async importPreview(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.originalname.endsWith('.xlsx')) {
      throw new BadRequestException(
        'Invalid file type. Only .xlsx files are supported.',
      );
    }

    return this.studentsService.parseExcelFile(file.buffer);
  }

  @Roles('admin', 'priest', 'instructor')
  @Post('import/execute')
  async importExecute(
    @Body() body: { validRows: any[]; classId?: string },
    @Request() req: any,
  ) {
    if (!body || !body.validRows || !Array.isArray(body.validRows)) {
      throw new BadRequestException(
        'Invalid payload. Expected an array of valid rows.',
      );
    }

    return this.studentsService.executeImport(
      body.validRows,
      req.user,
      body.classId,
    );
  }
}
