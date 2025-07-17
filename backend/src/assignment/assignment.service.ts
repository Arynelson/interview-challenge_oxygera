import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Patient } from '../patient/patient.entity';
import { Medication } from '../medication/medication.entity';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Medication)
    private medicationRepository: Repository<Medication>,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    // Verificar se o paciente existe
    const patient = await this.patientRepository.findOne({
      where: { id: createAssignmentDto.patientId },
    });
    if (!patient) {
      throw new BadRequestException(
        `Patient with ID ${createAssignmentDto.patientId} not found`,
      );
    }

    // Verificar se o medicamento existe
    const medication = await this.medicationRepository.findOne({
      where: { id: createAssignmentDto.medicationId },
    });
    if (!medication) {
      throw new BadRequestException(
        `Medication with ID ${createAssignmentDto.medicationId} not found`,
      );
    }

    const assignment = this.assignmentRepository.create({
      ...createAssignmentDto,
      startDate: new Date(createAssignmentDto.startDate),
    });

    return this.assignmentRepository.save(assignment);
  }

  async findAll(): Promise<Assignment[]> {
    return this.assignmentRepository.find({
      relations: ['patient', 'medication'],
    });
  }

  async findOne(id: number): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['patient', 'medication'],
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async update(
    id: number,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<Assignment> {
    const assignment = await this.findOne(id);

    // Verificar se o paciente existe (se fornecido)
    if (updateAssignmentDto.patientId) {
      const patient = await this.patientRepository.findOne({
        where: { id: updateAssignmentDto.patientId },
      });
      if (!patient) {
        throw new BadRequestException(
          `Patient with ID ${updateAssignmentDto.patientId} not found`,
        );
      }
    }

    // Verificar se o medicamento existe (se fornecido)
    if (updateAssignmentDto.medicationId) {
      const medication = await this.medicationRepository.findOne({
        where: { id: updateAssignmentDto.medicationId },
      });
      if (!medication) {
        throw new BadRequestException(
          `Medication with ID ${updateAssignmentDto.medicationId} not found`,
        );
      }
    }

    const updateData = {
      ...updateAssignmentDto,
      ...(updateAssignmentDto.startDate && {
        startDate: new Date(updateAssignmentDto.startDate),
      }),
    };

    Object.assign(assignment, updateData);
    return this.assignmentRepository.save(assignment);
  }

  async remove(id: number): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentRepository.remove(assignment);
  }

  // Método para calcular dias restantes para todas as atribuições
  calculateRemainingDays(assignment: Assignment): number {
    const today = new Date();
    const endDate = new Date(assignment.startDate);
    endDate.setDate(endDate.getDate() + assignment.numberOfDays);

    const timeDiff = endDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return Math.max(0, daysDiff);
  }

  async findAllWithRemainingDays(): Promise<any[]> {
    const assignments = await this.findAll();
    return assignments.map((assignment) => ({
      ...assignment,
      remainingDays: this.calculateRemainingDays(assignment),
    }));
  }
}
