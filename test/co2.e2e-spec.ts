import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("Co2Controller (e2e)", () => {
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
  it("/environment/co2?startDate&endDate (GET)", () => {
    return request(app.getHttpServer())
      .get(
        "/environment/co2?startDate=2021-01-01T00:00:00.000Z&endDate=2021-01-01T00:10:00.000Z",
      )
      .expect(200)
      .expect([
        { timestamp: "2021-01-01T00:00:00.000Z", value: 400 },
        { timestamp: "2021-01-01T00:05:00.000Z", value: 500 },
        { timestamp: "2021-01-01T00:10:00.000Z", value: 600 },
      ]);
  });

  //In this case, the seed data is from 2021-01-01 to 2021-01-10, which should return all 21 records
  it("/environment/co2?startDate&endDate (GET)", () => {
    return request(app.getHttpServer())
      .get(
        "/environment/co2?startDate=2021-01-01T00:00:00.000Z&endDate=2021-01-01T01:40:00.000Z",
      )
      .expect(200)
      .expect([
        { timestamp: "2021-01-01T00:00:00.000Z", value: 400 },
        { timestamp: "2021-01-01T00:05:00.000Z", value: 500 },
        { timestamp: "2021-01-01T00:10:00.000Z", value: 600 },
        { timestamp: "2021-01-01T00:15:00.000Z", value: 700 },
        { timestamp: "2021-01-01T00:20:00.000Z", value: 800 },
        { timestamp: "2021-01-01T00:25:00.000Z", value: 900 },
        { timestamp: "2021-01-01T00:30:00.000Z", value: 1000 },
        { timestamp: "2021-01-01T00:35:00.000Z", value: 1100 },
        { timestamp: "2021-01-01T00:40:00.000Z", value: 1200 },
        { timestamp: "2021-01-01T00:45:00.000Z", value: 1300 },
        { timestamp: "2021-01-01T00:50:00.000Z", value: 1400 },
        { timestamp: "2021-01-01T00:55:00.000Z", value: 1500 },
        { timestamp: "2021-01-01T01:00:00.000Z", value: 1600 },
        { timestamp: "2021-01-01T01:05:00.000Z", value: 1700 },
        { timestamp: "2021-01-01T01:10:00.000Z", value: 1800 },
        { timestamp: "2021-01-01T01:15:00.000Z", value: 1900 },
        { timestamp: "2021-01-01T01:20:00.000Z", value: 2000 },
        { timestamp: "2021-01-01T01:25:00.000Z", value: 2100 },
        { timestamp: "2021-01-01T01:30:00.000Z", value: 2200 },
        { timestamp: "2021-01-01T01:35:00.000Z", value: 2300 },
        { timestamp: "2021-01-01T01:40:00.000Z", value: 2400 },
      ]);
  });

  //In this case, the seed data is from 2020-01-01 to 2020-01-10, which should return 0 records
  it("/environment/co2?startDate&endDate get dates not in seed data(GET)", () => {
    return request(app.getHttpServer())
      .get(
        "/environment/co2?startDate=2020-01-01T00:00:00.000Z&endDate=2020-01-01T00:10:00.000Z",
      )
      .expect(200)
      .expect([]);
  });

  //patch thresholds test
  describe("/environment/co2/thresholds (PATCH)", () => {
    const toleranceInMilliseconds = 60000; // 1 minute

    test("updates thresholds and validates requestDate", async () => {
      const date = new Date();

      const response = await request(app.getHttpServer())
        .patch("/environment/co2/thresholds")
        .send({
          minVal: 0.5,
          maxVal: 10,
        });

      expect(response.body.minVal).toBe(0.5);
      expect(response.body.maxVal).toBe(10);
      expect(response.body.dateChanged).toBeNull();

      const requestDate = new Date(response.body.requestDate);
      expect(requestDate.getTime()).toBeGreaterThanOrEqual(
        date.getTime() - toleranceInMilliseconds,
      );
      expect(requestDate.getTime()).toBeLessThanOrEqual(
        date.getTime() + toleranceInMilliseconds,
      );
    });
  });

  //get thresholds test
  describe("/environment/co2/thresholds (GET)", () => {
    const toleranceInMilliseconds = 60000; // 1 minute

    test("updates thresholds and validates requestDate", async () => {
      const date = new Date();

      const response = await request(app.getHttpServer())
        .get("/environment/co2/thresholds")
        .send({
          minVal: 0.5,
          maxVal: 10,
        });

      expect(response.body.minVal).toBe(0.5);
      expect(response.body.maxVal).toBe(10);
      expect(response.body.dateChanged).toBeNull();

      const requestDate = new Date(response.body.requestDate);
      expect(requestDate.getTime()).toBeGreaterThanOrEqual(
        date.getTime() - toleranceInMilliseconds,
      );
      expect(requestDate.getTime()).toBeLessThanOrEqual(
        date.getTime() + toleranceInMilliseconds,
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
