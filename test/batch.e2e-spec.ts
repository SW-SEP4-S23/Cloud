import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
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
    await app.init();
  });
  //To see the seeded data, find the file in ../prisma/seed.ts
  describe("(POST) Batch", () => {
    test("Batch creation", () => {
      const species = plantSpecies[0].name;
      const amount = 10;
      const plantingDate = "2021-01-01T00:00:00.000Z";
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
});
