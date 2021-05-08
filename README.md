## Description

Example of running a bull job in forked process


The NestJS bull package is nice wrapper around bull which provides support for jobs being run in a separate process. 

To take advantage of bulls auto forking processing, you just need to provide a path to a file that can act as the jobs processor.

Create the separate file you want to run the job with

```ts
import { Logger } from '@nestjs/common';
import { DoneCallback, Job } from 'bull';

export default function (job: Job<{ message: string }>, cb: DoneCallback) {
  Logger.verbose(`${job.data.message} (pid ${process.pid})`, `SEPARATE`);
  cb(null, 'Hurrah');
}
```

Remember, this file will need to be able to be run on its own. Of course you can add additional imports and such, but it will be running in a different process so your application and its resources will not be available to it.

When registering your queues, specify the path to the separate file. Here I register 2 queues. One to run in the SAME process as the application and one the will run in a SEPARATE process

```ts
@Module({
  imports: [
    // register root
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    // register queues
    BullModule.registerQueue(
      {
        name: 'SAME', // this will run in same process as this module
      },
      {
        name: 'SEPARATE', // this will run in its own process
        processors: [join(__dirname, 'separate.process')],
      },
    ),
  ],
  controllers: [AppController],
  providers: [SameService],
})
export class AppModule {}
```

Then you can fire off jobs as normal. Below I fire off a job to a queue in the application process, then another job into the separate file

```ts
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
```

localhost:3000 then outputs

```bash
[Nest] 13400   - 08/05/2021, 16:49:18   [SAME] Knock knock. (pid 13400) +8821ms
[Nest] 2660   - 08/05/2021, 16:49:19   [SEPARATE] FORK OFF. (pid 2660)
```
