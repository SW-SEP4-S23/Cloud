import { DataType } from "@prisma/client";
import { Test } from "@nestjs/testing";
import { HttpServer, INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import {
  getThresholds,
  getHardcodedThresholds,
  postAndCheckForPendingThresholds,
  postThresholds,
} from "./common-tests";
import { hardcodedThresholds } from "../src/shared/new-threshold-dto";

describe("Humidity Controller", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  //To see the seeded data, find the file in ../prisma/seed.ts
  //Slight chance of failure if websucked recives data at the same time as the test is running
  describe("(GET) Datapoints", () => {
    test("Only the latest entry", () => {
      return request(app.getHttpServer())
        .get("/environment/humidity")
        .expect(200)
        .expect({ timestamp: "2021-01-01T01:40:00.000Z", value: 2.5 });
    });
  });

  describe("Exception Testing", () => {
    test("Path should always take start and end dates, not just STARTDATE", () => {
      return request(app.getHttpServer())
        .get("/environment/humidity?startDate=2021-01-01T00:10:00.000Z")
        .expect(400)
        .expect({
          statusCode: 400,
          message: "Both startDate and endDate must be provided together.",
        });
    });
    test("Path should always take start and end dates, not just ENDDATE", () => {
      return request(app.getHttpServer())
        .get("/environment/humidity?endDate=2021-01-01T00:10:00.000Z")
        .expect(400)
        .expect({
          statusCode: 400,
          message: "Both startDate and endDate must be provided together.",
        });
    });
    test("Start date must be before end date", () => {
      return request(app.getHttpServer())
        .get(
          "/environment/humidity?startDate=2021-02-01T00:10:00.000Z&endDate=2021-01-01T00:10:00.000Z",
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
  test("Return 21 records from dates", () => {
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
  test("Finding empty list", () => {
    return request(app.getHttpServer())
      .get(
        "/environment/humidity?startDate=2020-01-01T00:00:00.000Z&endDate=2020-01-01T00:10:00.000Z",
      )
      .expect(200)
      .expect([]);
  });

  //Testing using generalized methods from commonTests.ts
  describe("(GET, POST) Thresholds", () => {
    //Values to be used in the tests
    //This leaves possibility to make more tests with different values
    let humidityPath: string;
    let humidityMinValue: number;
    let humidityMaxValue: number;
    let request: HttpServer;

    describe("(POST) Thresholds", () => {
      test("Checking if POST succeeds", async () => {
        humidityPath = "/environment/humidity/thresholds";
        humidityMinValue = 10;
        humidityMaxValue = 30;

        request = app.getHttpServer();

        await postThresholds(
          request,
          humidityPath,
          humidityMinValue,
          humidityMaxValue,
          DataType.HUMIDITY,
        );
      });
    });

    describe("(GET) Thresholds", () => {
      test("Thresholds", async () => {
        humidityPath = "/environment/humidity/thresholds";
        humidityMinValue = 10;
        humidityMaxValue = 30;

        request = app.getHttpServer();

        await getThresholds(request, humidityPath, DataType.HUMIDITY);
      });

      test("Hardcoded thresholds", async () => {
        humidityPath = "/environment/humidity/hardcoded-thresholds";
        humidityMinValue = hardcodedThresholds.humidity.min;
        humidityMaxValue = hardcodedThresholds.humidity.max;

        request = app.getHttpServer();

        await getHardcodedThresholds(
          request,
          humidityPath,
          humidityMinValue,
          humidityMaxValue,
        );
      });
    });

    test("POST then check for pending", async () => {
      const humidityPath = "/environment/humidity/thresholds";
      const humidityMinValue = 5;
      const humidityMaxValue = 10;

      const request = app.getHttpServer();

      await postAndCheckForPendingThresholds(
        request,
        humidityPath,
        DataType.HUMIDITY,
        humidityMinValue,
        humidityMaxValue,
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
