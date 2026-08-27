import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [PrismaModule, GamificationModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
