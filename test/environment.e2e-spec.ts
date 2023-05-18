import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
// import { CommonTestsInterfaces, commonTests } from "./commonTests"; DEPRECATED

describe("EnvironmentController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  //To see the seeded data, find the file in ../prisma/seed.ts
  //Slight chance of failure if websocket receives data at the same time as the test is running
  describe("EnvironmentController (e2e) NO query Test", () => {
    it("/environment (GET)", () => {
      return request(app.getHttpServer())
        .get("/environment")
        .expect(200)
        .expect([
          {
            timestamp: "2021-01-01T01:40:00.000Z",
            type: "HUMIDITY",
            value: 2.5,
          },
          {
            timestamp: "2021-01-01T01:40:00.000Z",
            type: "CO2",
            value: 2400,
          },
          {
            timestamp: "2021-01-01T01:40:00.000Z",
            type: "TEMPERATURE",
            value: 60,
          },
        ]);
    });
  });

  describe("EnvironmentController (e2e) Query", () => {
    it("/environment?startDate&endDate (GET) -> Get 5 Elements from startDate = 2021-01-01T00:00:00.000Z and endDate 2021-01-01T00:20:00.000Z", async () => {
      const startDate = "2021-01-01T00:00:00.000Z";
      const endDate = "2021-01-01T00:20:00.000Z";
      const response = await request(app.getHttpServer())
        .get(`/environment?startDate=${startDate}&endDate=${endDate}`)
        .expect(200);
      expect(response.status).toBe(200);
      expect(response.body.CO2.length).toBe(5);
      expect(response.body.HUMIDITY.length).toBe(5);
      expect(response.body.TEMPERATURE.length).toBe(5);

      expect(response.body.CO2).toEqual([
        { timestamp: "2021-01-01T00:00:00.000Z", value: 400 },
        { timestamp: "2021-01-01T00:05:00.000Z", value: 500 },
        { timestamp: "2021-01-01T00:10:00.000Z", value: 600 },
        { timestamp: "2021-01-01T00:15:00.000Z", value: 700 },
        { timestamp: "2021-01-01T00:20:00.000Z", value: 800 },
      ]);

      expect(response.body.HUMIDITY).toEqual([
        { timestamp: "2021-01-01T00:00:00.000Z", value: 0.5 },
        { timestamp: "2021-01-01T00:05:00.000Z", value: 0.6 },
        { timestamp: "2021-01-01T00:10:00.000Z", value: 0.7 },
        { timestamp: "2021-01-01T00:15:00.000Z", value: 0.8 },
        { timestamp: "2021-01-01T00:20:00.000Z", value: 0.9 },
      ]);

      expect(response.body.TEMPERATURE).toEqual([
        { timestamp: "2021-01-01T00:00:00.000Z", value: 20 },
        { timestamp: "2021-01-01T00:05:00.000Z", value: 22 },
        { timestamp: "2021-01-01T00:10:00.000Z", value: 24 },
        { timestamp: "2021-01-01T00:15:00.000Z", value: 26 },
        { timestamp: "2021-01-01T00:20:00.000Z", value: 28 },
      ]);
    });
  });

  describe("EnvironmentController (e2e) Exception Testing", () => {
    it("/environment?startDate (GET)", () => {
      return request(app.getHttpServer())
        .get("/environment?startDate=2021-01-01T00:10:00.000Z")
        .expect(400)
        .expect({
          statusCode: 400,
          message: "Both startDate and endDate must be provided together.",
        });
    });
    it("/environment?endDate (GET)", () => {
      return request(app.getHttpServer())
        .get("/environment?endDate=2021-01-01T00:10:00.000Z")
        .expect(400)
        .expect({
          statusCode: 400,
          message: "Both startDate and endDate must be provided together.",
        });
    });
    it("/environment?startDate&endDate (GET)", () => {
      return request(app.getHttpServer())
        .get(
          "/environment?startDate=2021-02-01T00:10:00.000Z&endDate=2021-01-01T00:10:00.000Z",
        )
        .expect(400)
        .expect({
          statusCode: 400,
          message: "Start date cannot be after end date",
        });
    });
  });
});
