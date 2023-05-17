import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { CommonTestsInterfaces, commonTests } from "./commonTests";

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
  test("/environment/co2?startDate&endDate (GET)", () => {
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
  test("/environment/co2?startDate&endDate (GET)", () => {
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
  test("/environment/co2?startDate&endDate get dates not in seed data(GET)", () => {
    return request(app.getHttpServer())
      .get(
        "/environment/co2?startDate=2020-01-01T00:00:00.000Z&endDate=2020-01-01T00:10:00.000Z",
      )
      .expect(200)
      .expect([]);
  });

  //Testing using generalized methods from commonTests.ts
  describe("/environment/co2 using generalized methods (GET,PATCH)", () => {
    //Values to be used in the tests
    //This leaves possibility to make more tests with different values
    let co2Path: string;
    let co2MinValue: number;
    let co2MaxValue: number;
    let toleranceInMilliseconds: number; // 1 minute
    let request: any;

    //patch thresholds test
    describe("/environment/co2/thresholds (PATCH)", () => {
      test("Update patched value, check thresholdsRequest for the new request", async () => {
        co2Path = "/environment/co2";
        co2MinValue = 0.5;
        co2MaxValue = 10;

        //For date validation
        toleranceInMilliseconds = 60000; // 1 minute

        request = app.getHttpServer();

        (commonTests as CommonTestsInterfaces).patchThresholds(
          request,
          co2Path,
          co2MinValue,
          co2MaxValue,
          toleranceInMilliseconds,
        );
      });
    });

    //get thresholds test
    describe("/environment/co2/thresholds (GET) method", () => {
      test("GET Thresholds", async () => {
        co2Path = "/environment/co2";
        co2MinValue = 0.5;
        co2MaxValue = 10;

        //For date validation
        toleranceInMilliseconds = 60000; // 1 minute

        request = app.getHttpServer();

        (commonTests as CommonTestsInterfaces).getThresholds(
          request,
          co2Path,
          co2MinValue,
          co2MaxValue,
          toleranceInMilliseconds,
        );
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
