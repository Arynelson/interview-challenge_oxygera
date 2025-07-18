/* eslint-disable @typescript-eslint/no-unsafe-return */ /* eslint-disable @typescript-eslint/no-unused-vars */ /* eslint-disable @typescript-eslint/no-unsafe-call */ /* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { PatientService } from './patient.service';
import { Repository } from 'typeorm';

const mockPatient: Patient = {
  id: 1,
  name: 'John Doe',
  dateOfBirth: new Date('1990-01-01'),
  assignments: [],
};

describe('PatientService', () => {
  let service: PatientService;
  let repo: Repository<Patient>;

  const mockPatientRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockResolvedValue(mockPatient),
    find: jest.fn().mockResolvedValue([mockPatient]),
    findOne: jest.fn().mockResolvedValue(mockPatient),
    remove: jest.fn().mockResolvedValue(undefined),
    manager: {
      transaction: jest.fn().mockImplementation(async (cb) => await cb({
        remove: jest.fn()
      }))
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: getRepositoryToken(Patient),
          useValue: mockPatientRepository,
        },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
    repo = module.get<Repository<Patient>>(getRepositoryToken(Patient));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a patient', async () => {
    const dto = { name: 'John Doe', dateOfBirth: '1990-01-01' };
    const result = await service.create(dto as any);
    expect(result).toEqual(mockPatient);
  });

  it('should find all patients', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockPatient]);
  });

  it('should find a patient by id', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockPatient);
  });

  it('should remove a patient', async () => {
    await expect(service.remove(1)).resolves.toBeUndefined();
  });
});
