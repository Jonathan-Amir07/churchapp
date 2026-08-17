import { Module } from '@nestjs/common';
import { ReadingPlansController } from './reading-plans.controller';
import { ReadingPlansService } from './reading-plans.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReadingPlansController],
  providers: [ReadingPlansService]
})
export class ReadingPlansModule {}
