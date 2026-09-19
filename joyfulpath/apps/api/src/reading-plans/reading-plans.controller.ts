import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReadingPlansService } from './reading-plans.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reading-plans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReadingPlansController {
  constructor(private readonly readingPlansService: ReadingPlansService) {}

  @Get('active')
  getActivePlan() {
    return this.readingPlansService.getActivePlan();
  }

  @Get(':id/progress')
  getProgress(@Request() req: any, @Param('id') id: string) {
    return this.readingPlansService.getProgress(id, req.user.id);
  }

  @Roles('admin', 'instructor', 'priest')
  @Post(':id/progress')
  updateProgress(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    return this.readingPlansService.updateProgress(
      id,
      updateProgressDto,
      req.user.id,
    );
  }
}
