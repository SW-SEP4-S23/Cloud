import { DataType } from "@prisma/client";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import {
  getThresholds,
  postAndCheckForPendingThresholds,
  postThresholds,
} from "./common-tests";

describe("Co2 Controller", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  //To see the seeded data, find the file in ../prisma/seed.ts
  //Slight chance of failure if websocket receives data at the same time as the test is running
  describe("(GET) Datapoints", () => {
    test("Only the latest entry", () => {
      return request(app.getHttpServer())
        .get("/environment/co2")
        .expect(200)
        .expect({ timestamp: "2021-01-01T01:40:00.000Z", value: 2400 });
    });

    describe("Exception Testing", () => {
      test("Path should always take start and end dates, not just STARTDATE", () => {
        return request(app.getHttpServer())
          .get("/environment/co2?startDate=2021-01-01T00:10:00.000Z")
          .expect(400)
          .expect({
            statusCode: 400,
            message: "Both startDate and endDate must be provided together.",
          });
      });
      test("Path should always take start and end dates, not just ENDDATE", () => {
        return request(app.getHttpServer())
          .get("/environment/co2?endDate=2021-01-01T00:10:00.000Z")
          .expect(400)
          .expect({
            statusCode: 400,
            message: "Both startDate and endDate must be provided together.",
          });
      });
      test("Start date must be before end date", () => {
        return request(app.getHttpServer())
          .get(
            "/environment/co2?startDate=2021-02-01T00:10:00.000Z&endDate=2021-01-01T00:10:00.000Z",
          )
          .expect(400)
          .expect({
            statusCode: 400,
            message: "Start date cannot be after end date",
          });
      });
    });

    //In this case, the seed data is from 2021-01-01 to 2021-01-10, which should return 3 records
    test("Return 3 records from dates", () => {
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
    test("Return 21 records from dates ", () => {
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
    test("Finding empty list", () => {
      return request(app.getHttpServer())
        .get(
          "/environment/co2?startDate=2020-01-01T00:00:00.000Z&endDate=2020-01-01T00:10:00.000Z",
        )
        .expect(200)
        .expect([]);
    });
  });

  //Testing using generalized methods from commonTests.ts
  describe("(GET, POST) Thresholds", () => {
    //Values to be used in the tests
    //This leaves possibility to make more tests with different values
    let co2Path: string;
    let co2MinValue: number;
    let co2MaxValue: number;
    let request: any;

    describe("(POST) Thresholds)", () => {
      test("Checking if POST succeeds", async () => {
        co2Path = "/environment/co2/thresholds";
        co2MinValue = 0.5;
        co2MaxValue = 10;

        request = app.getHttpServer();

        await postThresholds(
          request,
          co2Path,
          co2MinValue,
          co2MaxValue,
          DataType.CO2,
        );
      });
    });

    test("GET Thresholds", async () => {
      co2Path = "/environment/co2/thresholds";
      co2MinValue = 0.5;
      co2MaxValue = 10;

      request = app.getHttpServer();

      await getThresholds(request, co2Path, DataType.CO2);
    });

    test("POST then check for pending", async () => {
      co2Path = "/environment/co2/thresholds";
      co2MinValue = 5;
      co2MaxValue = 10;

      request = app.getHttpServer();

      await postAndCheckForPendingThresholds(
        request,
        co2Path,
        DataType.CO2,
        co2MinValue,
        co2MaxValue,
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
