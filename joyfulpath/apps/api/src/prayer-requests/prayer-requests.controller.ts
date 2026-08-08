import { Controller, Get, Post, Body, Patch, Param, Request, UseGuards } from '@nestjs/common';
import { PrayerRequestsService } from './prayer-requests.service';
import { CreatePrayerRequestDto, UpdatePrayerRequestDto } from './dto/prayer-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('prayer-requests')
@UseGuards(JwtAuthGuard)
export class PrayerRequestsController {
  constructor(private readonly prayerRequestsService: PrayerRequestsService) {}

  @Post()
  create(@Request() req, @Body() dto: CreatePrayerRequestDto) {
    return this.prayerRequestsService.create(dto, req.user.id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdatePrayerRequestDto) {
    return this.prayerRequestsService.update(id, dto, req.user.id, req.user.role);
  }

  @Get()
  findAll(@Request() req) {
    return this.prayerRequestsService.findAll(req.user.id, req.user.role);
  }
}
