import { Injectable, NotFoundException } from '@nestjs/common';
import { JobRepository } from './job.repository';
import { CreateJobDto } from './dto/create-job.dto';
import { JobDocument } from './entities/job.entity';

@Injectable()
export class JobService {
  constructor(private readonly jobRepository: JobRepository) {}

  async findAll(): Promise<JobDocument[]> {
    return this.jobRepository.findAll();
  }

  async findOne(id: string): Promise<JobDocument> {
    const job = await this.jobRepository.findById(id);
    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }
    return job;
  }

  async create(dto: CreateJobDto): Promise<JobDocument> {
    return this.jobRepository.create(dto as unknown as Partial<JobDocument>);
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.jobRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }
  }
}
