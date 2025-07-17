import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { Assignment } from './assignment.entity';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(ValidationPipe) createAssignmentDto: CreateAssignmentDto,
  ): Promise<Assignment> {
    return this.assignmentService.create(createAssignmentDto);
  }

  @Get()
  findAll(): Promise<Assignment[]> {
    return this.assignmentService.findAll();
  }

  @Get('with-remaining-days')
  findAllWithRemainingDays(): Promise<any[]> {
    return this.assignmentService.findAllWithRemainingDays();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Assignment> {
    return this.assignmentService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.assignmentService.remove(id);
  }
}
