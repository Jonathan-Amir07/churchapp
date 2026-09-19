import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PrayerRequestsService } from './prayer-requests.service';
import {
  CreatePrayerRequestDto,
  UpdatePrayerRequestDto,
} from './dto/prayer-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('prayer-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrayerRequestsController {
  constructor(private readonly prayerRequestsService: PrayerRequestsService) {}

  @Roles('admin', 'instructor', 'priest', 'student', 'parent')
  @Post()
  create(@Request() req: any, @Body() dto: CreatePrayerRequestDto) {
    return this.prayerRequestsService.create(dto, req.user.userId);
  }

  @Roles('admin', 'instructor', 'priest', 'student', 'parent')
  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdatePrayerRequestDto,
  ) {
    return this.prayerRequestsService.update(
      id,
      dto,
      req.user.userId,
      req.user.role,
    );
  }

  @Get()
  findAll(@Request() req: any) {
    return this.prayerRequestsService.findAll(req.user.userId, req.user.role);
  }
}
