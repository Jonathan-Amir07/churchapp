import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Roles('admin', 'instructor', 'priest')
  @Post()
  create(@Request() req: any, @Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(
      createEventDto,
      req.user.id,
      req.user.role,
    );
  }

  @Get()
  findAll(@Request() req: any) {
    return this.eventsService.findAll(req.user.role);
  }

  @Roles('admin', 'instructor', 'priest')
  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateEventDto: any,
  ) {
    return this.eventsService.update(id, updateEventDto, req.user.role);
  }

  @Roles('admin', 'instructor', 'priest')
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.eventsService.remove(id, req.user.role);
  }

  @Roles('admin', 'instructor', 'priest')
  @Post(':id/rsvp')
  rsvp(@Request() req: any, @Param('id') id: string) {
    return this.eventsService.rsvp(id, req.user.id);
  }
}
