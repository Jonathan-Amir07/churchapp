import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Request() req, @Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto, req.user.id, req.user.role);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }
}
