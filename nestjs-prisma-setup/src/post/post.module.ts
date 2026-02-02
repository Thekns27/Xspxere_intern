import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { JwtModule } from '@nestjs/jwt';
import { UploadModule } from 'src/upload/upload.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from 'src/cron-schedule/task_service';
import { GatewaysModule } from 'src/gateways/gateways.module';

@Module({
  imports : [
    //ScheduleModule.forRoot(),
    GatewaysModule,
    UploadModule,
        JwtModule.register({
          secret: 'SECRET_KEY',
          signOptions: { expiresIn: '1h' },
        }),
  ],
  controllers: [PostController],
  providers: [PostService,TaskService],
  exports: [PostService],
})
export class PostModule {}
