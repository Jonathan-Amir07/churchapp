import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
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
}
