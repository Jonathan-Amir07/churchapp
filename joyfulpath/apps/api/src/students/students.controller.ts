import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll() {
    return this.studentsService.findAllStudents();
  }

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

  @Post('import/execute')
  async importExecute(@Body() body: { validRows: any[] }) {
    if (!body || !body.validRows || !Array.isArray(body.validRows)) {
      throw new BadRequestException(
        'Invalid payload. Expected an array of valid rows.',
      );
    }

    return this.studentsService.executeImport(body.validRows);
  }
}
