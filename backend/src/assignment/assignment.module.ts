import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { Assignment } from './assignment.entity';
import { Patient } from '../patient/patient.entity';
import { Medication } from '../medication/medication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, Patient, Medication])],
  controllers: [AssignmentController],
  providers: [AssignmentService],
  exports: [AssignmentService],
})
export class AssignmentModule {}
