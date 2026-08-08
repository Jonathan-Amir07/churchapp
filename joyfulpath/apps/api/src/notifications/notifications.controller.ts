import { Controller, Get, Patch, Param, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Request() req) {
    return this.notificationsService.findAllForUser(req.user.id);
  }

  @Patch(':id/read')
  markAsRead(@Request() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }
}
