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

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('qr/generate')
  generateQr(@Request() req: any, @Body() dto: QrGenerateDto) {
    return this.attendanceService.generateQr(dto, req.user.id, req.user.role);
  }

  @Post('qr/scan')
  scanQr(@Request() req: any, @Body() dto: QrScanDto) {
    return this.attendanceService.scanQr(dto, req.user.id);
  }

  @Post('manual')
  submitManual(@Request() req: any, @Body() dto: ManualAttendanceDto) {
    return this.attendanceService.submitManual(dto, req.user.id, req.user.role);
  }

  @Get('class/:classId')
  getReports(@Request() req: any, @Param('classId') classId: string) {
    return this.attendanceService.getReports(
      classId,
      req.user.id,
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
      req.user.id,
      req.user.role,
    );
  }
}
