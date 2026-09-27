import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(
    @Request()
    req: {
      user: { userId: string; role: string; familyId?: string };
    },
  ) {
    return this.notificationsService.findAllForUser(req.user.userId);
  }

  @Patch(':id/read')
  markAsRead(
    @Request()
    req: { user: { userId: string; role: string; familyId?: string } },
    @Param('id') id: string,
  ) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @Patch('mark-all-read')
  markAllAsRead(
    @Request()
    req: {
      user: { userId: string; role: string; familyId?: string };
    },
  ) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Delete(':id')
  remove(
    @Request()
    req: { user: { userId: string; role: string; familyId?: string } },
    @Param('id') id: string,
  ) {
    return this.notificationsService.remove(id, req.user.userId);
  }
}
