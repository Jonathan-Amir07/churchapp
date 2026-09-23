import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { ParentsModule } from './parents/parents.module';
import { ClassesModule } from './classes/classes.module';
import { LessonsModule } from './lessons/lessons.module';
import { TasksModule } from './tasks/tasks.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { AttendanceModule } from './attendance/attendance.module';
import { EventsModule } from './events/events.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReadingPlansModule } from './reading-plans/reading-plans.module';
import { RolesModule } from './roles/roles.module';
import { FamiliesModule } from './families/families.module';
import { PriestsModule } from './priests/priests.module';
import { InstructorsModule } from './instructors/instructors.module';
import { FilesModule } from './files/files.module';
import { CommonModule } from './common/common.module';
import { PrayerRequestsModule } from './prayer-requests/prayer-requests.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { GamificationModule } from './gamification/gamification.module';
import { StoreModule } from './store/store.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { GamesModule } from './games/games.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    // Rate Limiting: 60 requests per 60 seconds per IP
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    ParentsModule,
    ClassesModule,
    LessonsModule,
    TasksModule,
    QuizzesModule,
    AttendanceModule,
    EventsModule,
    NotificationsModule,
    ReadingPlansModule,
    RolesModule,
    FamiliesModule,
    PriestsModule,
    InstructorsModule,
    FilesModule,
    CommonModule,
    PrayerRequestsModule,
    AnnouncementsModule,
    GamificationModule,
    StoreModule,
    AnalyticsModule,
    GamesModule,
    MailModule,
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
