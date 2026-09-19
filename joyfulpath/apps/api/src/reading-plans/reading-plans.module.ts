import { Module } from '@nestjs/common';
import { ReadingPlansController } from './reading-plans.controller';
import { ReadingPlansService } from './reading-plans.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [PrismaModule, GamificationModule],
  controllers: [ReadingPlansController],
  providers: [ReadingPlansService],
})
export class ReadingPlansModule {}
