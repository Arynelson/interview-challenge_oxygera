/* eslint-disable @typescript-eslint/no-unsafe-member-access */ /* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Medications (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  it('should create a medication', async () => {
    const response = await request(app.getHttpServer())
      .post('/medications')
      .send({
        name: 'Ibuprofen',
        dosage: 400,
        frequency: 3,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Ibuprofen');
  });

  it('should return a list of medications', async () => {
    const response = await request(app.getHttpServer())
      .get('/medications')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
  afterAll(async () => {
    await app.close();
  });
});