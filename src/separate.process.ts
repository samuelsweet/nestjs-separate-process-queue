import { Logger } from '@nestjs/common';
import { DoneCallback, Job } from 'bull';

export default function (job: Job<{ message: string }>, cb: DoneCallback) {
  Logger.verbose(`${job.data.message} (pid ${process.pid})`, `SEPARATE`);
  cb(null, 'Hurrah');
}
