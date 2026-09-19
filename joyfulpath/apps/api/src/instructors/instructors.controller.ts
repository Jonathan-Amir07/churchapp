import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Roles('admin', 'priest', 'instructor')
  @Get('dashboard')
  getDashboardStats(@Req() req: any) {
    return this.instructorsService.getDashboardStats(req.user.userId);
  }
}
