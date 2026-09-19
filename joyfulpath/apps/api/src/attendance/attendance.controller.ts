import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { QrGenerateDto, QrScanDto } from './dto/qr.dto';
import { ManualAttendanceDto } from './dto/manual-attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Roles('admin', 'instructor', 'priest')
  @Post('qr/generate')
  generateQr(@Request() req: any, @Body() dto: QrGenerateDto) {
    return this.attendanceService.generateQr(
      dto,
      req.user.userId,
      req.user.role,
    );
  }

  @Post('qr/scan')
  scanQr(@Request() req: any, @Body() dto: QrScanDto) {
    return this.attendanceService.scanQr(dto, req.user.userId);
  }

  @Roles('admin', 'instructor', 'priest')
  @Post('manual')
  submitManual(@Request() req: any, @Body() dto: ManualAttendanceDto) {
    return this.attendanceService.submitManual(
      dto,
      req.user.userId,
      req.user.role,
    );
  }

  @Get('class/:classId')
  getReports(@Request() req: any, @Param('classId') classId: string) {
    return this.attendanceService.getReports(
      classId,
      req.user.userId,
      req.user.role,
    );
  }
  @Get('percentage/:classId/:studentId')
  getStudentPercentage(
    @Request() req: any,
    @Param('classId') classId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.attendanceService.getStudentAttendancePercentage(
      studentId,
      classId,
      req.user.userId,
      req.user.role,
    );
  }
}
