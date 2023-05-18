import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
// import { CommonTestsInterfaces, commonTests } from "./commonTests"; DEPRECATED

describe("Environment Controller", () => {
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
  describe("(GET) Datapoints", () => {
    test("Only the latest entries", () => {
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

    //Get 5 records from the startDate = 2021-01-01T00:00:00.000Z and endDate 2021-01-01T00:20:00.000Z
    test("Get 5 records from dates ", async () => {
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

    describe("Exception Testing", () => {
      test("Path should always take start and end dates, not just STARTDATE", () => {
        return request(app.getHttpServer())
          .get("/environment?startDate=2021-01-01T00:10:00.000Z")
          .expect(400)
          .expect({
            statusCode: 400,
            message: "Both startDate and endDate must be provided together.",
          });
      });
      test("Path should always take start and end dates not just ENDDATE", () => {
        return request(app.getHttpServer())
          .get("/environment?endDate=2021-01-01T00:10:00.000Z")
          .expect(400)
          .expect({
            statusCode: 400,
            message: "Both startDate and endDate must be provided together.",
          });
      });
      test("Start date must be before end date", () => {
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
});
