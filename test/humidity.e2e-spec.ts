import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("HumidityController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  //To see the seeded data, find the file in ../prisma/seed.ts

  //In this case, the seed data is from 2021-01-01 to 2021-01-10, which should return 3 records
  it("/environment/humidity?startDate&endDate (GET)", () => {
    return request(app.getHttpServer())
      .get(
        "/environment/humidity?startDate=2021-01-01T00:00:00.000Z&endDate=2021-01-01T00:10:00.000Z",
      )
      .expect(200)
      .expect([
        { timestamp: "2021-01-01T00:00:00.000Z", value: 0.5 },
        { timestamp: "2021-01-01T00:05:00.000Z", value: 0.6 },
        { timestamp: "2021-01-01T00:10:00.000Z", value: 0.7 },
      ]);
  });

  //In this case, the seed data is from 2021-01-01 to 2021-01-10, which should return all 21 records
  it("/environment/humidity?startDate&endDate (GET)", () => {
    return request(app.getHttpServer())
      .get(
        "/environment/humidity?startDate=2021-01-01T00:00:00.000Z&endDate=2021-01-01T01:40:00.000Z",
      )
      .expect(200)
      .expect([
        { timestamp: "2021-01-01T00:00:00.000Z", value: 0.5 },
        { timestamp: "2021-01-01T00:05:00.000Z", value: 0.6 },
        { timestamp: "2021-01-01T00:10:00.000Z", value: 0.7 },
        { timestamp: "2021-01-01T00:15:00.000Z", value: 0.8 },
        { timestamp: "2021-01-01T00:20:00.000Z", value: 0.9 },
        { timestamp: "2021-01-01T00:25:00.000Z", value: 1 },
        { timestamp: "2021-01-01T00:30:00.000Z", value: 1.1 },
        { timestamp: "2021-01-01T00:35:00.000Z", value: 1.2 },
        { timestamp: "2021-01-01T00:40:00.000Z", value: 1.3 },
        { timestamp: "2021-01-01T00:45:00.000Z", value: 1.4 },
        { timestamp: "2021-01-01T00:50:00.000Z", value: 1.5 },
        { timestamp: "2021-01-01T00:55:00.000Z", value: 1.6 },
        { timestamp: "2021-01-01T01:00:00.000Z", value: 1.7 },
        { timestamp: "2021-01-01T01:05:00.000Z", value: 1.8 },
        { timestamp: "2021-01-01T01:10:00.000Z", value: 1.9 },
        { timestamp: "2021-01-01T01:15:00.000Z", value: 2 },
        { timestamp: "2021-01-01T01:20:00.000Z", value: 2.1 },
        { timestamp: "2021-01-01T01:25:00.000Z", value: 2.2 },
        { timestamp: "2021-01-01T01:30:00.000Z", value: 2.3 },
        { timestamp: "2021-01-01T01:35:00.000Z", value: 2.4 },
        { timestamp: "2021-01-01T01:40:00.000Z", value: 2.5 },
      ]);
  });

  //In this case, the seed data is from 2020-01-01 to 2020-01-10, which should return 0 records
  it("/environment/humidity?startDate&endDate get dates not in seed data(GET)", () => {
    return request(app.getHttpServer())
      .get(
        "/environment/humidity?startDate=2020-01-01T00:00:00.000Z&endDate=2020-01-01T00:10:00.000Z",
      )
      .expect(200)
      .expect([]);
  });

  afterAll(async () => {
    await app.close();
  });
});
