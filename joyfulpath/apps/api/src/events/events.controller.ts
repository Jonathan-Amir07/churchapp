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

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Request() req: any, @Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(
      createEventDto,
      req.user.id,
      req.user.role,
    );
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateEventDto: any,
  ) {
    return this.eventsService.update(id, updateEventDto, req.user.role);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.eventsService.remove(id, req.user.role);
  }

  @Post(':id/rsvp')
  rsvp(@Request() req: any, @Param('id') id: string) {
    return this.eventsService.rsvp(id, req.user.id);
  }
}
