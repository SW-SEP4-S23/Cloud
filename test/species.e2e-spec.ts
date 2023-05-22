import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("Species controller", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  describe("(GET) stock/species", () => {
    test("Get all species", () => {
      return request(app.getHttpServer())
        .get("/stock/species")
        .expect(200)
        .expect([]);
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
