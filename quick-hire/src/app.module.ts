import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { JobModule } from './job/job.module';
import { ApplicationModule } from './application/application.module';
import type { ExecutionContext } from '@nestjs/common';
import type { ThrottlerLimitDetail } from '@nestjs/throttler';

const ONE_MIN = 60_000;
const BLOCK_15_MIN = 15 * 60 * 1000;

function getTracker(req: { ip?: string; socket?: { remoteAddress?: string } }) {
  return req.ip ?? req.socket?.remoteAddress ?? 'unknown';
}

function rateLimitErrorMessage(
  _ctx: ExecutionContext,
  detail: ThrottlerLimitDetail,
): string {
  return detail.isBlocked
    ? 'Too many requests. Your IP has been temporarily blocked.'
    : 'Too many requests.';
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'default', limit: 100, ttl: ONE_MIN },
        {
          name: 'strict',
          limit: 10,
          ttl: ONE_MIN,
          blockDuration: BLOCK_15_MIN,
        },
        {
          name: 'application',
          limit: 5,
          ttl: ONE_MIN,
          blockDuration: BLOCK_15_MIN,
        },
      ],
      getTracker,
      errorMessage: rateLimitErrorMessage,
    }),
    JobModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
