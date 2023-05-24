import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { DataType } from "@prisma/client";
import { NewThresholdWrapperDTO } from "../src/environment/shared/dto/new-threshold-wrapper-dto";
import { hardcodedThresholds } from "../src/environment/shared/dto/new-threshold-dto";

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

  //Testing using generelized tests from commonTests.ts
  describe("(GET, POST) Thresholds", () => {
    //Values to be used in the tests
    //This leaves possiblity to make more tests with different values
    let minMaxValuesObject: NewThresholdWrapperDTO;

    describe("(POST) Thresholds", () => {
      test("Checking if POST succeeds", () => {
        minMaxValuesObject = {
          newTemperatureThreshold: {
            minValue: -20,
            maxValue: 80,
          },
          newHumidityThreshold: {
            minValue: 0,
            maxValue: 80,
          },
          newCo2Threshold: {
            minValue: 0.0,
            maxValue: 0.5,
          },
        };

        return request(app.getHttpServer())
          .post("/environment/thresholds")
          .send(minMaxValuesObject)
          .expect(201)
          .expect({
            count: 3,
          });
      });

      describe("GET Thresholds", () => {
        test("Thresholds,", () => {
          return request(app.getHttpServer())
            .get("/environment/thresholds")
            .expect(200)
            .expect((request) => {
              expect(request.body.upToDateThresholds).toEqual({
                CO2: {
                  dataType: DataType.CO2,
                  minValue: null,
                  maxValue: null,
                },
                TEMPERATURE: {
                  dataType: DataType.TEMPERATURE,
                  minValue: null,
                  maxValue: null,
                },
                HUMIDITY: {
                  dataType: DataType.HUMIDITY,
                  minValue: null,
                  maxValue: null,
                },
              });
            });
        });
        test("Hardcoded Thresholds", () => {
          return request(app.getHttpServer())
            .get("/environment/hardcoded-thresholds")
            .expect(200)
            .expect((request) => {
              expect(request.body).toEqual(hardcodedThresholds);
            });
        });
      });

      test("POST Thresholds, then GET to check if they are pending", () => {
        minMaxValuesObject = {
          newTemperatureThreshold: {
            minValue: -30,
            maxValue: 50,
          },
          newHumidityThreshold: {
            minValue: 10,
            maxValue: 90,
          },
          newCo2Threshold: {
            minValue: 0.2,
            maxValue: 0.3,
          },
        };

        return request(app.getHttpServer())
          .post("/environment/thresholds")
          .send(minMaxValuesObject)
          .expect(201)
          .then(() => {
            return request(app.getHttpServer())
              .get("/environment/thresholds")
              .expect(200)
              .expect((request) => {
                expect(request.body.pendingThresholds).toEqual({
                  co2: {
                    dataType: DataType.CO2,
                    minValueReq: 0.2,
                    maxValueReq: 0.3,
                  },
                  temperature: {
                    dataType: DataType.TEMPERATURE,
                    minValueReq: -30,
                    maxValueReq: 50,
                  },
                  humidity: {
                    dataType: DataType.HUMIDITY,
                    minValueReq: 10,
                    maxValueReq: 90,
                  },
                });
              });
          });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
