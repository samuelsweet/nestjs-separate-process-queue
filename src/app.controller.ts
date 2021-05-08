import { InjectQueue } from '@nestjs/bull';
import { Controller, Get } from '@nestjs/common';
import { Queue } from 'bull';

@Controller()
export class AppController {
  constructor(
    @InjectQueue('SAME') private readonly same: Queue,
    @InjectQueue('SEPARATE') private readonly separate: Queue,
  ) {}

  @Get()
  getHello(): string {
    // Example of adding a job processed in same thread
    this.same.add({ message: 'Knock knock.' });

    // Example of adding a job processed in separate thread
    this.separate.add({ message: 'FORK OFF.' });

    return 'ok';
  }
}
