


import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class TaskService {
//  private readonly logger = new Logger(AppService.name);
 constructor(private readonly dbService: DatabaseService){}

  getHello(): string {
    return 'Hello World!';
  }
@Cron(CronExpression.EVERY_MINUTE)
async backUpDB() {
  console.log("Starting check ispulished is true?...")

  const toEditTime = new Date(Date.now() - 180000)

  return this.dbService.post.updateMany({
    where: {
      isScheduled: false,
      isPublished: true,
      createdAt: {
        lte: toEditTime,
      },
    },
    data: {
      isPublished: false,
      isScheduled: true,
      scheduledAt: new Date().toISOString(),
    },
  })
}

}
