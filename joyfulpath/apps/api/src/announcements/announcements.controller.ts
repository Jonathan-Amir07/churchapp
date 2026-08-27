import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateAnnouncementDto) {
    return this.announcementsService.create(dto, req.user.id, req.user.role);
  }

  @Get()
  findAll(@Query('classId') classId?: string) {
    return this.announcementsService.findAll(classId);
  }
}
