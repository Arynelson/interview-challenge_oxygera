import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentService } from './assignment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Assignment } from './assignment.entity';
import { Patient } from '../patient/patient.entity';
import { Medication } from '../medication/medication.entity';
//import { Repository } from 'typeorm';

describe('AssignmentService', () => {
  let service: AssignmentService;
  //let assignmentRepository: Repository<Assignment>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentService,
        {
          provide: getRepositoryToken(Assignment),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Patient),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Medication),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AssignmentService>(AssignmentService);
    // assignmentRepository = module.get<Repository<Assignment>>(getRepositoryToken(Assignment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateRemainingDays', () => {
    it('should calculate remaining days correctly for ongoing treatment', () => {
      const today = new Date();
      const startDate = new Date();
      startDate.setDate(today.getDate() - 5); // Começou 5 dias atrás

      const assignment = {
        id: 1,
        startDate,
        numberOfDays: 10, // Tratamento de 10 dias
        patientId: 1,
        medicationId: 1,
      } as Assignment;

      const remainingDays = service.calculateRemainingDays(assignment);

      // Deveria ter 5 dias restantes (10 - 5)
      expect(remainingDays).toBe(5);
    });

    it('should return 0 for completed treatment', () => {
      const today = new Date();
      const startDate = new Date();
      startDate.setDate(today.getDate() - 15); // Começou 15 dias atrás

      const assignment = {
        id: 1,
        startDate,
        numberOfDays: 10, // Tratamento de 10 dias (já terminou)
        patientId: 1,
        medicationId: 1,
      } as Assignment;

      const remainingDays = service.calculateRemainingDays(assignment);

      // Tratamento já terminou, deveria retornar 0
      expect(remainingDays).toBe(0);
    });

    it('should calculate remaining days for treatment ending today', () => {
      const today = new Date();
      const startDate = new Date();
      startDate.setDate(today.getDate() - 9); // Começou 9 dias atrás

      const assignment = {
        id: 1,
        startDate,
        numberOfDays: 10, // Tratamento de 10 dias (termina hoje)
        patientId: 1,
        medicationId: 1,
      } as Assignment;

      const remainingDays = service.calculateRemainingDays(assignment);

      // Deveria ter 1 dia restante (termina hoje)
      expect(remainingDays).toBe(1);
    });

    it('should calculate remaining days for future treatment', () => {
      const today = new Date();
      const startDate = new Date();
      startDate.setDate(today.getDate() + 2); // Começará em 2 dias

      const assignment = {
        id: 1,
        startDate,
        numberOfDays: 7, // Tratamento de 7 dias
        patientId: 1,
        medicationId: 1,
      } as Assignment;

      const remainingDays = service.calculateRemainingDays(assignment);

      // Deveria ter 9 dias restantes (2 + 7)
      expect(remainingDays).toBe(9);
    });
  });
});
