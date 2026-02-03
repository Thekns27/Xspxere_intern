import { Payload } from './../../generated/prisma/internal/prismaNamespace';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BullService {
  constructor(
    @InjectQueue('email-queue')
    private readonly emailQueue: Queue,
  ) {}

  async sendWelcomeEmail(payload:{email:string,name:string}) {
    await this.emailQueue.add('send-welcome', payload, {
      attempts: 3,
      delay: 4000,
      backoff: 5000,
    });
  }
}