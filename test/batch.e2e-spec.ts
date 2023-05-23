import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { CreateBatch } from "../src/batch/dto/create-batch";
import { plantSpecies } from "../prisma/test-data";

describe("Batch Controller", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });
  //To see the seeded data, find the file in ../prisma/seed.ts
  describe("(POST) Batch", () => {
    test("Batch creation", () => {
      const species = plantSpecies[0].name;
      const amount = 10;
      const plantingDate = "2022-01-01T00:00:00.000Z";
      const batch = new CreateBatch();
      batch.species = species;
      batch.amount = amount;
      batch.plantingDate = new Date(plantingDate);

      return request(app.getHttpServer())
        .post("/stock/batch")
        .send(batch)
        .expect(201)
        .then((res) => {
          const expectedResponse = [
            {
              amount: amount,
              harvestDate: null,
              plantingDate: plantingDate,
              ps_Name: species,
            },
            { count: amount },
          ];

          const receivedResponse = [
            {
              amount: res.body[0].amount,
              harvestDate: res.body[0].harvestDate,
              plantingDate: res.body[0].plantingDate,
              ps_Name: res.body[0].ps_Name,
            },
            { count: res.body[1].count },
          ];

          expect(receivedResponse).toEqual(expectedResponse);
        });
    });
  });

  describe("(GET) Batch, query", () => {
    it("Get no queries, should return all batches", () => {
      return request(app.getHttpServer())
        .get("/stock/batch")
        .expect(200)
        .then((res) => {
          expect(res.body.length).toEqual(3);
        });
    });
    it("Get with interval query, should return batches with planting date within interval", () => {
      const startDate = "2020-12-01T00:00:00.000Z";
      const endDate = "2021-01-01T00:00:00.000Z";
      const expectedLength = 2;
      return request(app.getHttpServer())
        .get(`/stock/batch?startDate=${startDate}&endDate=${endDate}`)
        .expect(200)
        .then((res) => {
          expect(res.body.length).toEqual(expectedLength);
          const body1PlantingDate = new Date(res.body[0].plantingDate);
          const body2PlantingDate = new Date(res.body[1].plantingDate);
          expect(body1PlantingDate >= new Date(startDate)).toBeTruthy();
          expect(body1PlantingDate <= new Date(endDate)).toBeTruthy();
          expect(body2PlantingDate >= new Date(startDate)).toBeTruthy();
          expect(body2PlantingDate <= new Date(endDate)).toBeTruthy();
        });
    });
    it("Get with is harvested = true, should return 2 batches", () => {
      const expectedLength = 2;
      const isHarvested = true;
      return request(app.getHttpServer())
        .get(`/stock/batch?isHarvested=${isHarvested}`)
        .expect(200)
        .then((res) => {
          expect(res.body.length).toEqual(expectedLength);
          const body1HarvestDate = new Date(res.body[0].harvestDate);
          const body2HarvestDate = new Date(res.body[1].harvestDate);
          expect(body1HarvestDate).toBeTruthy();
          expect(body2HarvestDate).toBeTruthy();
        });
    });
    it("Get with is harvested = false, should return 1 batch", () => {
      const expectedLength = 1;
      const isHarvested = false;
      return request(app.getHttpServer())
        .get(`/stock/batch?isHarvested=${isHarvested}`)
        .expect(200)
        .then((res) => {
          expect(res.body.length).toEqual(expectedLength);
          expect(res.body[0].harvestDate).toBeFalsy();
        });
    });
  });
  describe("(GET) Batch, id", () => {
    it("Get batch with id, should return batch", () => {
      const id = 1;
      return request(app.getHttpServer())
        .get(`/stock/batch/${id}`)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toEqual(id);
        });
    });
    it("Get batch with id, should return 404", () => {
      const id = 100;
      return request(app.getHttpServer()).get(`/stock/batch/${id}`).expect(404);
    });
  });
  describe("(Patch) Batch, id", () => {
    it("Update batch with id, should return updated batch", () => {
      const id = 1;
      const harvestDate = "2021-01-01T00:00:00.000Z";
      return request(app.getHttpServer())
        .patch(`/stock/batch/${id}`)
        .send({ harvestDate: harvestDate })
        .expect(200)
        .then((res) => {
          expect(res.body.harvestDate).toEqual(harvestDate);
        });
    });
    it("Update batch with id, should return 404", () => {
      const id = 100;
      const harvestDate = "2021-01-01T00:00:00.000Z";
      return request(app.getHttpServer())
        .patch(`/stock/batch/${id}`)
        .send({ harvestDate: harvestDate })
        .expect(404);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
