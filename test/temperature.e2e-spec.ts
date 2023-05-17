import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { CommonTestsInterfaces, commonTests } from "./commonTests";

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
  //Slight chance of failure if websucked recives data at the same time as the test is running
  describe("TemperatureController (e2e) NO query Test", () => {
    it("/environment/co2 (GET)", () => {
      return request(app.getHttpServer())
        .get("/environment/temperature")
        .expect(200)
        .expect({ timestamp: "2021-01-01T01:40:00.000Z", value: 60 });
    });
  });

  describe("TemperatureController (e2e) Exception Testing", () => {
    it("/environment/temperature?startDate (GET)", () => {
      return request(app.getHttpServer())
        .get("/environment/temperature?startDate=2021-01-01T00:10:00.000Z")
        .expect(400)
        .expect({
          statusCode: 400,
          message: "Both startDate and endDate must be provided together.",
        });
    });
    it("/environment/temperature?endDate (GET)", () => {
      return request(app.getHttpServer())
        .get("/environment/temperature?endDate=2021-01-01T00:10:00.000Z")
        .expect(400)
        .expect({
          statusCode: 400,
          message: "Both startDate and endDate must be provided together.",
        });
    });
    it("/environment/temperature?startDate&endDate (GET)", () => {
      return request(app.getHttpServer())
        .get(
          "/environment/temperature?startDate=2021-02-01T00:10:00.000Z&endDate=2021-01-01T00:10:00.000Z",
        )
        .expect(400)
        .expect({
          statusCode: 400,
          message: "Start date cannot be after end date",
        });
    });
  });

  //In this case, the seed data is from 2021-01-01 to 2021-01-10, which should return 3 records
  test("/environment/temperature?startDate&endDate get specific dates from seed data (GET)", () => {
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
  test("/environment/temperature get all dates from seed data (GET)", () => {
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

  //In this case, the seed data is from 2020-01-01 to 2020-01-10, which should return 0 records
  test("/environment/temperature?startDate&endDate get dates not in seed data (GET)", () => {
    return request(app.getHttpServer())
      .get(
        "/environment/temperature?startDate=2020-01-01T00:00:00.000Z&endDate=2020-01-01T01:40:00.000Z",
      )
      .expect(200)
      .expect([]);
  });

  // Testing using generalized methods from commonTests.ts
  describe("/environment/temperature using generalized methods (GET, PATCH)", () => {
    // Values to be used in the tests
    // This leaves the possibility to make more tests with different values
    let temperaturePath: string;
    let temperatureMinValue: number;
    let temperatureMaxValue: number;
    let toleranceInMilliseconds: number; // 1 minute
    let request: any;

    // PATCH thresholds test
    describe("/environment/temperature/thresholds (PATCH)", () => {
      test("Update patched value, check thresholdsRequest for the new request", async () => {
        temperaturePath = "/environment/temperature";
        temperatureMinValue = 0.5;
        temperatureMaxValue = 10;

        // For date validation
        toleranceInMilliseconds = 60000; // 1 minute

        request = app.getHttpServer();

        (commonTests as CommonTestsInterfaces).patchThresholds(
          request,
          temperaturePath,
          temperatureMinValue,
          temperatureMaxValue,
          toleranceInMilliseconds,
        );
      });
    });

    // GET thresholds test
    describe("/environment/temperature/thresholds (GET) method", () => {
      test("GET Thresholds", async () => {
        temperaturePath = "/environment/temperature";
        temperatureMinValue = 0.5;
        temperatureMaxValue = 10;

        // For date validation
        toleranceInMilliseconds = 60000; // 1 minute

        request = app.getHttpServer();

        (commonTests as CommonTestsInterfaces).getThresholds(
          request,
          temperaturePath,
          temperatureMinValue,
          temperatureMaxValue,
          toleranceInMilliseconds,
        );
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
