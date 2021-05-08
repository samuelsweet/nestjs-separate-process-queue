import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('SAME')
export class SameProcess {
  @Process()
  hello(job: Job<{ message: string }>) {
    Logger.verbose(`${job.data.message} (pid ${process.pid})`, `SAME`);
  }
}
