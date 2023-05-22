import { DataType } from "@prisma/client";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { CreateBatch } from "../src/batch/dto/create-batch";

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
      const batch = new CreateBatch();
      batch.plantingDate = new Date("2021-01-01T00:00:00.000Z");
      batch.species = "Tomato";
      batch.amount = 10;
      return request(app.getHttpServer())
        .post("/batch")
        .send(batch)
        .expect(201)
        .expect({
          id: 1,
          plantingDate: "2021-01-01T00:00:00.000Z",
          harvestDate: null,
          species: "Tomato",
          amount: 10,
        });
    });
  });
});
