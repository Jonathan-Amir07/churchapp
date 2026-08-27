import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GamificationModule } from '../gamification/gamification.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, GamificationModule, NotificationsModule],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
