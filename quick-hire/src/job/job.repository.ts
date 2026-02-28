import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../common/base/base.repository';
import { Job, JobDocument } from './entities/job.entity';

@Injectable()
export class JobRepository extends BaseRepository<JobDocument> {
  constructor(@InjectModel(Job.name) model: Model<JobDocument>) {
    super(model);
  }
}
