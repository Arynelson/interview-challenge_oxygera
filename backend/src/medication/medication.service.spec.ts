/* eslint-disable @typescript-eslint/no-unsafe-return */ /* eslint-disable @typescript-eslint/no-unused-vars */ /* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MedicationService } from './medication.service';
import { Medication } from './medication.entity';
import { Repository } from 'typeorm';

const mockMedication: Medication = {
  id: 1,
  name: 'Ibuprofeno',
  dosage: 400,
  frequency: 3,
  assignments: [],
};

describe('MedicationService', () => {
  let service: MedicationService;

  const mockMedicationRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockResolvedValue(mockMedication),
    find: jest.fn().mockResolvedValue([mockMedication]),
    findOne: jest.fn().mockResolvedValue(mockMedication),
    manager: {
      transaction: jest.fn().mockImplementation(
        async (cb) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          await cb({
            remove: jest.fn(),
          }),
      ),
    },
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationService,
        {
          provide: getRepositoryToken(Medication),
          useValue: mockMedicationRepository,
        },
      ],
    }).compile();

    service = module.get<MedicationService>(MedicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create medication', async () => {
    const dto = { name: 'Ibuprofeno', dosage: 400, frequency: 3 };
    const result = await service.create(dto as any);
    expect(result).toMatchObject(dto);
  });

  it('should return all medications', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockMedication]);
  });

  it('should find medication by id', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockMedication);
  });

  it('should update medication', async () => {
    const dto = { name: 'Novo Nome' };
    const result = await service.update(1, dto as any);
    expect(result.name).toEqual('Novo Nome');
  });

  it('should remove medication', async () => {
    await expect(service.remove(1)).resolves.toBeUndefined();
  });
});
