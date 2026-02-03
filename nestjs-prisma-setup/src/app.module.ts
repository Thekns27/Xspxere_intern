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
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { CustomBullModule } from './bull/bull.modules';

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
    ScheduleModule.forRoot({
      cronJobs: true,
      // intervals: false,
      // timeouts: true,
    }),
    TagsModule,
    GatewaysModule,
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: 'redis-14174.c252.ap-southeast-1-1.ec2.cloud.redislabs.com',
        port: 14174,
        username: 'default',
        password: 'eXkQEAxkhOX31lmVTIBWeEqKIWtQJfyq',
      },
    }),
    CustomBullModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
