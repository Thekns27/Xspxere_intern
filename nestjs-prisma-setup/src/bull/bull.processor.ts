import { MailerService } from '@nestjs-modules/mailer';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { User } from 'src/users/entities/user.entity';
@Processor('email-queue')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly mailer: MailerService) {
    super();
  }
  async process(job: Job) {
    if (job.name === 'send-welcome') {
      const data = job.data as User;
      console.log(data);
      try {
        await this.mailer.sendMail({
          to: data.email,
          subject: 'Hello',
          template: 'welcome.hbs',
          context: {
            name: data.name,
            email: data.email,
          },
        });
      } catch (error) {
        // console.log(error);
        throw Error('error:Failed to send email');
      }
    }
  }
}
/**@Processor('email-queue')
export class EmailProcessor {
  @Process('send-welcome')
  async handle(job: Job<{ email: string; name: string }>) {
    console.log('Sending welcome email to', job.data.email);
  }
}
 */
