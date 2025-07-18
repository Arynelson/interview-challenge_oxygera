/* eslint-disable @typescript-eslint/no-unsafe-member-access *//* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('E2E API Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /medications', () => {
    it('should create medication with valid input', async () => {
      const response = await request(app.getHttpServer())
        .post('/medications')
        .send({ name: 'Paracetamol', dosage: 500, frequency: 3 })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Paracetamol');
    });

    it('should fail with invalid input', async () => {
      const response = await request(app.getHttpServer())
        .post('/medications')
        .send({ name: '', dosage: -1 })
        .expect(400);

      expect(response.body.message).toBeDefined();
      expect(Array.isArray(response.body.message)).toBe(true);
    });
  });

  describe('POST /patients', () => {
    it('should create patient with valid input', async () => {
      const response = await request(app.getHttpServer())
        .post('/patients')
        .send({ name: 'Maria', dateOfBirth: '1992-06-15' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Maria');
    });

    it('should fail with invalid date format', async () => {
      const response = await request(app.getHttpServer())
        .post('/patients')
        .send({ name: 'Carlos', dateOfBirth: 'invalid-date' })
        .expect(400);

      expect(response.body.message).toContain('dateOfBirth must be a Date instance');
    });
  });

  describe('GET /medications', () => {
    it('should return structured JSON', async () => {
      const response = await request(app.getHttpServer())
        .get('/medications')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('dosage');
        expect(response.body[0]).toHaveProperty('frequency');
      }
    });
  });
});
