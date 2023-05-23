import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { Test } from "@nestjs/testing";
import { plantLogs, batchLogs, plant } from "../prisma/test-data";
import * as request from "supertest";
import { CreateBatchLogDto } from "../src/logs/dto/create-batch-log-dto";
import { CreatePlantLogDto } from "../src/logs/dto/create-plant-log-dto";

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
        .expect((res) => {
          expect(res.body.plantLogs).toMatchObject(plantLogs);
          expect(res.body.batchLogs).toMatchObject(batchLogs);
        });
    });
  });

  describe("(GET '/plants/logs') All Plant Logs", () => {
    test("Should return all plant logs", () => {
      return request(app.getHttpServer())
        .get("/stock/plants/logs")
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject(plantLogs);
        });
    });
  });

  describe("(GET '/batches/logs') All Batch Logs", () => {
    test("Should return all batch logs", () => {
      return request(app.getHttpServer())
        .get("/stock/batches/logs")
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject(batchLogs);
        });
    });
  });

  describe("(GET '/plants/:plantId/logs') Plant Logs", () => {
    test("Should return plant logs for the plantId", () => {
      const existingId = 1;
      return request(app.getHttpServer())
        .get(`/stock/plants/${existingId}/logs`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject(
            plantLogs.filter((log) => log.p_Id === existingId),
          );
        });
    });

    test("Should return 404 if plant does not exist", () => {
      const nonExistingId = 1337;
      return request(app.getHttpServer())
        .get(`/stock/plants/${nonExistingId}/logs`)
        .expect(404)
        .expect({
          statusCode: 404,
          message: `Plant with id ${nonExistingId} not found`,
        });
    });

    test("Should return 400 if plantId is not a number", () => {
      const nonNumberId = "notANumber";
      return request(app.getHttpServer())
        .get(`/stock/plants/${nonNumberId}/logs`)
        .expect(400)
        .expect({
          statusCode: 400,
          message: "Validation failed (numeric string is expected)",
          error: "Bad Request",
        });
    });
  });

  describe("(GET '/batches/:batchId/logs') Batch Logs", () => {
    test("Should return batch logs for the batchId", () => {
      const existingId = 1;
      return request(app.getHttpServer())
        .get(`/stock/batches/${existingId}/logs`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject(
            batchLogs.filter((log) => log.pb_Id === existingId),
          );
        });
    });

    test("Should return 404 if batch does not exist", () => {
      const nonExistingId = 1337;
      return request(app.getHttpServer())
        .get(`/stock/batches/${nonExistingId}/logs`)
        .expect(404)
        .expect({
          statusCode: 404,
          message: `Batch with id ${nonExistingId} not found`,
        });
    });

    test("Should return 400 if batchId is not a number", () => {
      const nonNumberId = "notANumber";
      return request(app.getHttpServer())
        .get(`/stock/batches/${nonNumberId}/logs`)
        .expect(400)
        .expect({
          statusCode: 400,
          message: "Validation failed (numeric string is expected)",
          error: "Bad Request",
        });
    });
  });

  describe("(POST '/plants/:plantId/logs') Create Plant Log", () => {
    test("Should create a plant log", () => {
      const plantId = 1;

      const createPlantLogDto = new CreatePlantLogDto();
      createPlantLogDto.message = "Test message";

      return request(app.getHttpServer())
        .post(`/stock/plants/${plantId}/logs`)
        .send(createPlantLogDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject({
            message: "Test message",
            p_Id: plantId,
          });
        });
    });

    test("Should return 404 if plant does not exist", () => {
      const nonExistingId = 1337;

      const createBatchLogDto = new CreateBatchLogDto();
      createBatchLogDto.message = "Test message";

      return request(app.getHttpServer())
        .post(`/stock/plants/${nonExistingId}/logs`)
        .send(createBatchLogDto)
        .expect(404)
        .expect({
          statusCode: 404,
          message: `Plant with id ${nonExistingId} not found`,
        });
    });

    test("Should return 400 if plantId is not a number", () => {
      const nonNumberId = "notANumber";

      const createBatchLogDto = new CreateBatchLogDto();
      createBatchLogDto.message = "Test message";

      return request(app.getHttpServer())
        .post(`/stock/plants/${nonNumberId}/logs`)
        .send(createBatchLogDto)
        .expect(400)
        .expect({
          statusCode: 400,
          message: "Validation failed (numeric string is expected)",
          error: "Bad Request",
        });
    });
  });

  describe("(POST '/batches/:batchId/logs') Create Batch Log", () => {
    test("Should create a batch log", () => {
      const batchId = 1;

      const createBatchLogDto = new CreateBatchLogDto();
      createBatchLogDto.message = "Test message";

      return request(app.getHttpServer())
        .post(`/stock/batches/${batchId}/logs`)
        .send(createBatchLogDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject({
            message: "Test message",
            pb_Id: batchId,
          });
        });
    });

    test("Should return 404 if batch does not exist", () => {
      const nonExistingId = 1337;

      const createBatchLogDto = new CreateBatchLogDto();
      createBatchLogDto.message = "Test message";

      return request(app.getHttpServer())
        .post(`/stock/batches/${nonExistingId}/logs`)
        .send(createBatchLogDto)
        .expect(404)
        .expect({
          statusCode: 404,
          message: `Batch with id ${nonExistingId} not found`,
        });
    });

    test("Should return 400 if batchId is not a number", () => {
      const nonNumberId = "notANumber";

      const createBatchLogDto = new CreateBatchLogDto();
      createBatchLogDto.message = "Test message";

      return request(app.getHttpServer())
        .post(`/stock/batches/${nonNumberId}/logs`)
        .send(createBatchLogDto)
        .expect(400)
        .expect({
          statusCode: 400,
          message: "Validation failed (numeric string is expected)",
          error: "Bad Request",
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
