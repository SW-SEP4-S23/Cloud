import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { Test } from "@nestjs/testing";
import { plantLogs, batchLogs } from "../prisma/test-data";
import * as request from "supertest";

describe("Logs Controller", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe("(GET '/logs') All Logs", () => {
    test("Should return all logs", () => {
      return request(app.getHttpServer())
        .get("/stock/logs")
        .expect(200)
        .expect({
          plantLogs,
          batchLogs,
        });
    });
  });

  describe("(GET '/plants/logs') All Plant Logs", () => {
    test("Should return all plant logs", () => {
      return request(app.getHttpServer())
        .get("/stock/plants/logs")
        .expect(200)
        .expect(plantLogs);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
