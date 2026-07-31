import { Module } from '@nestjs/common';
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
import { RewardsModule } from './rewards/rewards.module';
import { EventsModule } from './events/events.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReadingPlansModule } from './reading-plans/reading-plans.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, StudentsModule, ParentsModule, ClassesModule, LessonsModule, TasksModule, QuizzesModule, AttendanceModule, RewardsModule, EventsModule, NotificationsModule, ReadingPlansModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
