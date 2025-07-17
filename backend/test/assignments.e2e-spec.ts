/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Assignments (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  let createdAssignmentId: number;

  it('should create an assignment', async () => {
    const payload = {
      patientId: 1,
      medicationId: 1,
      startDate: '2025-07-15',
      numberOfDays: 10,
    };

    const response = await request(app.getHttpServer())
      .post('/assignments')
      .send(payload)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.numberOfDays).toBe(payload.numberOfDays);

    createdAssignmentId = response.body.id;
  });

  it('should get all assignments', async () => {
    const response = await request(app.getHttpServer())
      .get('/assignments')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get remaining days', async () => {
    const response = await request(app.getHttpServer())
      .get('/assignments/with-remaining-days')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('remainingDays');
  });

  it('should delete the created assignment', async () => {
    await request(app.getHttpServer())
      .delete(`/assignments/${createdAssignmentId}`)
      .expect(204);
  });
  afterAll(async () => {
    await app.close();
  });
});