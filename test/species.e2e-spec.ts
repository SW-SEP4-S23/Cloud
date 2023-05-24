import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { UpdateSpeciesDTO } from "../src/plant_species/dto/update-species-dto";
import { NewSpeciesDTO } from "../src/plant_species/dto/new-species-dto";

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
        .expect({
          "Aloe Vera": {
            OptimalCo2: 400,
            optimalHumidity: 0.5,
            optimalTemperature: 20,
            totalPlants: 10,
          },
          Basil: {
            OptimalCo2: 300,
            optimalHumidity: 5,
            optimalTemperature: 30,
            totalPlants: 10,
          },
        });
    });
  });

  describe("(GET) stock/species/:species", () => {
    test("Get species", () => {
      return request(app.getHttpServer())
        .get("/stock/species/Basil")
        .expect(200)
        .expect({
          name: "Basil",
          OptimalCo2: 300,
          optimalHumidity: 5,
          optimalTemperature: 30,
          totalPlants: 10,
          PlantBatches: {
            2: {
              amount: 10,
              harvestDate: "2021-01-01T00:00:00.000Z",
              plantingDate: "2020-12-01T00:00:00.000Z",
            },
          },
        });
    });
    test("Get species that does not exist", () => {
      return request(app.getHttpServer())
        .get("/stock/species/NOT_A_SPECIES")
        .expect(404)
        .expect({
          statusCode: 404,
          message: "Species with name NOT_A_SPECIES not found",
        });
    });
  });

  describe("(POST) stock/species", () => {
    let newSpecies: NewSpeciesDTO;

    test("Create species", () => {
      newSpecies = {
        name: "Tomato",
        optimalCo2: 200,
        optimalTemperature: 20,
      };
      return request(app.getHttpServer())
        .post("/stock/species")
        .send(newSpecies)
        .expect(201)
        .expect({
          name: "Tomato",
          OptimalCo2: 200,
          optimalTemperature: 20,
          optimalHumidity: null,
        });
    });
    test("Create species that already exists", () => {
      newSpecies = {
        name: "Basil",
      };
      return request(app.getHttpServer())
        .post("/stock/species")
        .send(newSpecies)
        .expect(400)
        .expect({
          statusCode: 400,
          message: `Species with name ${newSpecies.name} already exists`,
        });
    });
  });

  describe("(PATCH) /stock/species/", () => {
    let speciesToUpdate: UpdateSpeciesDTO;

    test("Update species that does not exist", () => {
      speciesToUpdate = {
        updateValues: {
          name: "ERROR",
        },
        nameToBeChanged: "NOT_A_SPECIES",
      };
      return request(app.getHttpServer())
        .patch(`/stock/species/${speciesToUpdate.nameToBeChanged}`)
        .send(speciesToUpdate.updateValues)
        .expect(404)
        .expect({
          statusCode: 404,
          message: `Species with name ${speciesToUpdate.nameToBeChanged} not found`,
        });
    });
    test("Update species with already existing name", () => {
      speciesToUpdate = {
        updateValues: {
          name: "Aloe Vera",
        },
        nameToBeChanged: "Basil",
      };
      return request(app.getHttpServer())
        .patch(`/stock/species/${speciesToUpdate.nameToBeChanged}`)
        .send(speciesToUpdate.updateValues)
        .expect(400)
        .expect({
          statusCode: 400,
          message: `Species with name ${speciesToUpdate.updateValues.name} already exists`,
        });
    });
    test("Update species", () => {
      speciesToUpdate = {
        updateValues: {
          name: "Pineapple",
          optimalCo2: 200,
          optimalTemperature: 20,
        },
        nameToBeChanged: "Basil",
      };
      return request(app.getHttpServer())
        .patch(`/stock/species/${speciesToUpdate.nameToBeChanged}`)
        .send(speciesToUpdate.updateValues)
        .expect(200)
        .expect({
          name: "Pineapple",
          OptimalCo2: 200,
          optimalHumidity: 5,
          optimalTemperature: 20,
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
