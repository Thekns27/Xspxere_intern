import { Module } from '@nestjs/common';
import { TaskService } from './task_service';

@Module({
  //   controllers: [TagsController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TagsModule {}
