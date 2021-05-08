import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { AppController } from './app.controller';
import { SameService } from './same.process';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      {
        name: 'SAME',
      },
      {
        name: 'SEPARATE',
        processors: [join(__dirname, 'separate', 'separate.service')],
      },
    ),
  ],
  controllers: [AppController],
  providers: [SameService],
})
export class AppModule {}
