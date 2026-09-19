import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('class/:classId/overview')
  getClassOverview(@Request() req: any, @Param('classId') classId: string) {
    return this.analyticsService.getClassOverview(
      classId,
      req.user.id,
      req.user.role,
    );
  }

  @Get('dashboard')
  getGlobalDashboard(@Request() req: any) {
    return this.analyticsService.getGlobalDashboard(req.user.role);
  }

  @Get('student/:studentId')
  getStudentAnalytics(
    @Request() req: any,
    @Param('studentId') studentId: string,
  ) {
    return this.analyticsService.getStudentAnalytics(
      studentId,
      req.user.userId || req.user.id,
      req.user.role,
    );
  }
}
