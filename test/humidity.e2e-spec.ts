import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { getThresholds, postThresholds } from "./commonTests";

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
  //Slight chance of failure if websucked recives data at the same time as the test is running
  describe("HumidityController (e2e) NO query Test", () => {
    it("/environment/humidity (GET)", () => {
      return request(app.getHttpServer())
        .get("/environment/humidity")
        .expect(200)
        .expect({ timestamp: "2021-01-01T01:40:00.000Z", value: 2.5 });
    });
  });

  describe("HumidityController (e2e) Exception Testing", () => {
    it("/environment/humidity?startDate (GET)", () => {
      return request(app.getHttpServer())
        .get("/environment/humidity?startDate=2021-01-01T00:10:00.000Z")
        .expect(400)
        .expect({
          statusCode: 400,
          message: "Both startDate and endDate must be provided together.",
        });
    });
    it("/environment/humidity?endDate (GET)", () => {
      return request(app.getHttpServer())
        .get("/environment/humidity?endDate=2021-01-01T00:10:00.000Z")
        .expect(400)
        .expect({
          statusCode: 400,
          message: "Both startDate and endDate must be provided together.",
        });
    });
    it("/environment/humidity?startDate&endDate (GET)", () => {
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
  test("/environment/humidity?startDate&endDate (GET)", () => {
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
  test("/environment/humidity?startDate&endDate (GET)", () => {
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
  test("/environment/humidity?startDate&endDate get dates not in seed data(GET)", () => {
    return request(app.getHttpServer())
      .get(
        "/environment/humidity?startDate=2020-01-01T00:00:00.000Z&endDate=2020-01-01T00:10:00.000Z",
      )
      .expect(200)
      .expect([]);
  });

  //Testing using generalized methods from commonTests.ts
  describe("/environment/humidity using generalized methods (GET,PATCH)", () => {
    //Values to be used in the tests
    //This leaves possibility to make more tests with different values
    let humidityPath: string;
    let humidityMinValue: number;
    let humidityMaxValue: number;
    let toleranceInMilliseconds: number; // 1 minute
    let request: any;

    //patch thresholds test
    describe("/environment/humidity/thresholds (PATCH)", () => {
      test("Update patched value, check thresholdsRequest for the new request", async () => {
        humidityPath = "/environment/humidity";
        humidityMinValue = 10;
        humidityMaxValue = 30;

        //For date validation
        toleranceInMilliseconds = 60000; // 1 minute

        request = app.getHttpServer();

        await postThresholds(
          request,
          humidityPath,
          humidityMinValue,
          humidityMaxValue,
          toleranceInMilliseconds,
        );
      });
    });

    //get thresholds test
    describe("/environment/humidity/thresholds (GET) method", () => {
      test("GET Thresholds", async () => {
        humidityPath = "/environment/humidity/thresholds";
        humidityMinValue = 10;
        humidityMaxValue = 30;

        //For date validation
        toleranceInMilliseconds = 60000; // 1 minute

        request = app.getHttpServer();

        await getThresholds(
          request,
          humidityPath,
          humidityMinValue,
          humidityMaxValue,
          toleranceInMilliseconds,
        );
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
