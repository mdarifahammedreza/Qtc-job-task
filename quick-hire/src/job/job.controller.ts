import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({ summary: 'List all jobs' })
  @ApiResponse({ status: 200, description: 'List of jobs' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async list() {
    return this.jobService.findAll();
  }

  @Get(':id')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({ summary: 'Get single job details' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Job details' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async getOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ strict: { limit: 10, ttl: 60000, blockDuration: 900000 } })
  @ApiOperation({ summary: 'Create job (admin)' })
  @ApiBody({ type: CreateJobDto })
  @ApiResponse({ status: 201, description: 'Job created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 429, description: 'Too many requests; IP blocked' })
  async create(@Body() dto: CreateJobDto) {
    return this.jobService.create(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ strict: { limit: 10, ttl: 60000, blockDuration: 900000 } })
  @ApiOperation({ summary: 'Delete job (admin)' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiResponse({ status: 204, description: 'Job deleted' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 429, description: 'Too many requests; IP blocked' })
  async delete(@Param('id') id: string) {
    await this.jobService.delete(id);
  }
}
