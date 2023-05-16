import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("TemperatureController (e2e)", () => {
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
  it("/environment/temperature?startDate&endDate get specific dates from seed data (GET)", () => {
    return request(app.getHttpServer())
      .get(
        "/environment/temperature?startDate=2021-01-01T00:00:00.000Z&endDate=2021-01-01T00:10:00.000Z",
      )
      .expect(200)
      .expect([
        { timestamp: "2021-01-01T00:00:00.000Z", value: 20 },
        { timestamp: "2021-01-01T00:05:00.000Z", value: 22 },
        { timestamp: "2021-01-01T00:10:00.000Z", value: 24 },
      ]);
  });

  //In this case, the seed data is from 2021-01-01T00:00:00.000Z to 2021-01-01T01:40:00.000Z, which should return all 21 records from the seeding
  it("/environment/temperature get all dates from seed data (GET)", () => {
    return request(app.getHttpServer())
      .get(
        "/environment/temperature?startDate=2021-01-01T00:00:00.000Z&endDate=2021-01-01T01:40:00.000Z",
      )
      .expect(200)
      .expect([
        { timestamp: "2021-01-01T00:00:00.000Z", value: 20 },
        { timestamp: "2021-01-01T00:05:00.000Z", value: 22 },
        { timestamp: "2021-01-01T00:10:00.000Z", value: 24 },
        { timestamp: "2021-01-01T00:15:00.000Z", value: 26 },
        { timestamp: "2021-01-01T00:20:00.000Z", value: 28 },
        { timestamp: "2021-01-01T00:25:00.000Z", value: 30 },
        { timestamp: "2021-01-01T00:30:00.000Z", value: 32 },
        { timestamp: "2021-01-01T00:35:00.000Z", value: 34 },
        { timestamp: "2021-01-01T00:40:00.000Z", value: 36 },
        { timestamp: "2021-01-01T00:45:00.000Z", value: 38 },
        { timestamp: "2021-01-01T00:50:00.000Z", value: 40 },
        { timestamp: "2021-01-01T00:55:00.000Z", value: 42 },
        { timestamp: "2021-01-01T01:00:00.000Z", value: 44 },
        { timestamp: "2021-01-01T01:05:00.000Z", value: 46 },
        { timestamp: "2021-01-01T01:10:00.000Z", value: 48 },
        { timestamp: "2021-01-01T01:15:00.000Z", value: 50 },
        { timestamp: "2021-01-01T01:20:00.000Z", value: 52 },
        { timestamp: "2021-01-01T01:25:00.000Z", value: 54 },
        { timestamp: "2021-01-01T01:30:00.000Z", value: 56 },
        { timestamp: "2021-01-01T01:35:00.000Z", value: 58 },
        { timestamp: "2021-01-01T01:40:00.000Z", value: 60 },
      ]);
  });

  //Testing for a 404 error since there is no seeded data from 2020 to 2020.
  it("/environment/temperature?startDate&endDate get dates not in seed data (GET)", () => {
    return request(app.getHttpServer())
      .get(
        "/environment/temperature?startDate=2020-01-01T00:00:00.000Z&endDate=2020-01-01T01:40:00.000Z",
      )
      .expect(200)
      .expect([]);
  });

  afterAll(async () => {
    await app.close();
  });
});
