import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Assignment } from '../assignment/assignment.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create({
      ...createPatientDto,
      dateOfBirth: new Date(createPatientDto.dateOfBirth),
    });
    return this.patientRepository.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find({
      relations: ['assignments', 'assignments.medication'],
    });
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['assignments', 'assignments.medication'],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  async update(
    id: number,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const patient = await this.findOne(id);

    const updateData = {
      ...updatePatientDto,
      ...(updatePatientDto.dateOfBirth && {
        dateOfBirth: new Date(updatePatientDto.dateOfBirth),
      }),
    };

    Object.assign(patient, updateData);
    return this.patientRepository.save(patient);
  }

  async remove(id: number): Promise<void> {
    // Carrega o paciente com as assignments
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['assignments'],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    // Remove todas as assignments associadas primeiro
    if (patient.assignments && patient.assignments.length > 0) {
      await this.patientRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.remove(
            Assignment,
            patient.assignments,
          );
          await transactionalEntityManager.remove(Patient, patient);
        },
      );
    } else {
      await this.patientRepository.remove(patient);
    }
  }
}
