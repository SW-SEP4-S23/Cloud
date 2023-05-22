import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { Test } from "@nestjs/testing";
import * as request from "supertest";

describe("Plants Controller", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  //To see the seeded data, find the file in ../prisma/TODO

  describe("(GET) Plants", () => {
    test("Get all plants", () => {
      return request(app.getHttpServer())
        .get("/stock/plants")
        .expect(200)
        .expect([{}]);
    });

    test("Get plant by id", () => {
      return request(app.getHttpServer())
        .get("/stock/plants/1")
        .expect(200)
        .expect({});
    });
  });

  describe("Error handling", () => {
    test("Get plant with non-existant", () => {
      return request(app.getHttpServer())
        .get("/stock/plants/100")
        .expect(404)
        .expect({});
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
