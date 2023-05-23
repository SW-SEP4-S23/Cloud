import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { plant } from "../prisma/test-data";

describe("Plants Controller", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  //To see the seeded data, find the file in ../prisma/seed.ts

  describe("(GET) Plants", () => {
    //Expected data is created from the testData inside of ../prisma/seed.ts,
    //it has to be specially created since the return values of plants carry data from other tables within the databse
    test("Get all plants", async () => {
      const expectedResponse = [
        {
          id: 1,
          pb_Id: 1,
          pb: expect.objectContaining({
            plantingDate: "2020-12-01T00:00:00.000Z",
            harvestDate: "2021-01-01T00:00:00.000Z",
            ps: expect.any(Object),
          }),
          PlantLogs: expect.arrayContaining([expect.any(Object)]),
        },
        {
          id: 2,
          pb_Id: 1,
          pb: expect.objectContaining({
            plantingDate: "2020-12-01T00:00:00.000Z",
            harvestDate: "2021-01-01T00:00:00.000Z",
            ps: expect.any(Object),
          }),
          PlantLogs: expect.arrayContaining([expect.any(Object)]),
        },
        {
          id: 3,
          pb_Id: 2,
          pb: expect.objectContaining({
            plantingDate: "2020-12-01T00:00:00.000Z",
            harvestDate: "2021-01-01T00:00:00.000Z",
            ps: expect.any(Object),
          }),
          PlantLogs: [],
        },
      ];

      const response = await request(app.getHttpServer())
        .get("/stock/plants")
        .expect(200);

      expect(response.body).toEqual(expectedResponse);
    });

    test("Get plant by id", () => {
      return request(app.getHttpServer())
        .get("/stock/plants/1")
        .expect(200)
        .expect({
          id: 1,
          pb_Id: 1,
          pb: {
            plantingDate: "2020-12-01T00:00:00.000Z",
            harvestDate: "2021-01-01T00:00:00.000Z",
            ps: { name: "Aloe Vera" },
          },
          PlantLogs: [
            {
              id: 1,
              timestamp: "2021-01-01T00:00:00.000Z",
              message: "Plant 1 is doing well",
              p_Id: 1,
            },
          ],
        });
    });
  });

  describe("Error handling", () => {
    test("Get plant with non-existant", () => {
      return request(app.getHttpServer()).get("/stock/plants/100").expect({
        statusCode: 404,
        message: "Plant not found",
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
