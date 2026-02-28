import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './entities/job.entity';
import { JobRepository } from './job.repository';
import { JobService } from './job.service';
import { JobController } from './job.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
  ],
  controllers: [JobController],
  providers: [JobRepository, JobService],
  exports: [JobService, JobRepository],
})
export class JobModule {}
