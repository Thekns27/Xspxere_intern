import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { PostModule } from './post/post.module';
import { CategoriesOnPostsModule } from './categories-on-posts/categories-on-posts.module';
import { ProfileModule } from './profile/profile.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TagsModule } from './tags/tags.module';
import { GatewaysModule } from './gateways/gateways.module';
import { TaskModule } from './cron-schedule/task.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    PostModule,
    TagsModule,
    TaskModule,
    CategoriesOnPostsModule,
    ProfileModule,
    ScheduleModule.forRoot(
      {
      cronJobs: true,
     // intervals: false,
     // timeouts: true,
      }
    ),
   TagsModule,
   GatewaysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
