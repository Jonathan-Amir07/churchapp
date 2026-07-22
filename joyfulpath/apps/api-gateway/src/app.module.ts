import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { redisStore } from 'cache-manager-ioredis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LessonModule } from './lesson/lesson.module';
import { QuizModule } from './quiz/quiz.module';
import { GameModule } from './game/game.module';
import { RewardModule } from './reward/reward.module';
import { StoreModule } from './store/store.module';
import { EventModule } from './event/event.module';
import { PrayerModule } from './prayer/prayer.module';
import { NotificationModule } from './notification/notification.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    CommonModule, AuthModule, UserModule, AttendanceModule, LessonModule, QuizModule, GameModule, RewardModule, StoreModule, EventModule, PrayerModule, NotificationModule, AnalyticsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
