import { PrismaClient } from "@prisma/client";
import { DataType } from "@prisma/client";
import {
  batchLogs,
  plant,
  plantBatch,
  plantLogs,
  plantSpecies,
  speciesLogs,
} from "./test-data";

export async function seedDatabase(prisma: PrismaClient) {
  await Promise.all([seedDatapoints(prisma), seedPlantSpecies(prisma)]);
}

export async function undoSeedDatabase(prisma: PrismaClient) {
  await prisma.datapoint.deleteMany();

  await prisma.plantLogs.deleteMany();
  await prisma.$queryRaw`ALTER SEQUENCE "PlantLogs_id_seq" RESTART WITH 1;`;
  await prisma.batchLogs.deleteMany();
  await prisma.$queryRaw`ALTER SEQUENCE "BatchLogs_id_seq" RESTART WITH 1;`;
  await prisma.speciesLogs.deleteMany();
  await prisma.$queryRaw`ALTER SEQUENCE "SpeciesLogs_id_seq" RESTART WITH 1;`;

  await prisma.plant.deleteMany();
  await prisma.$queryRaw`ALTER SEQUENCE "Plant_id_seq" RESTART WITH 1;`;
  await prisma.plantBatch.deleteMany();
  await prisma.$queryRaw`ALTER SEQUENCE "PlantBatch_id_seq" RESTART WITH 1;`;
  await prisma.plantSpecies.deleteMany();
}

async function seedPlantSpecies(prisma: PrismaClient) {
  await prisma.plantSpecies.createMany({
    data: plantSpecies,
  });

  await prisma.plantBatch.createMany({
    data: plantBatch,
  });

  await prisma.plant.createMany({
    data: plant,
  });

  await Promise.all([
    prisma.plantLogs.createMany({
      data: plantLogs,
    }),
    prisma.batchLogs.createMany({
      data: batchLogs,
    }),
    prisma.speciesLogs.createMany({
      data: speciesLogs,
    }),
  ]);
}

async function seedDatapoints(prisma: PrismaClient) {
  const data = [];

  const iterations = 21; //nr of DataPoint for each sensor
  const startDate = new Date("2021-01-01T00:00:00.000Z");

  // !Might need change if we limit the range of the data
  let co2 = 400;
  let humidity = 0.5;
  let temperature = 20;

  for (let i = 0; i < iterations; i++) {
    data.push({
      timestamp: new Date(startDate),
      type: DataType.CO2,
      value: co2,
    });
    data.push({
      timestamp: new Date(startDate),
      type: DataType.HUMIDITY,
      value: humidity,
    });
    data.push({
      timestamp: new Date(startDate),
      type: DataType.TEMPERATURE,
      value: temperature,
    });

    startDate.setMinutes(startDate.getMinutes() + 5);
    co2 += 100;
    humidity = parseFloat((humidity + 0.1).toFixed(1));
    temperature += 2;
  }
  const datapoints = await prisma.datapoint.createMany({
    data: data,
  });

  console.log("Just created: " + JSON.stringify(datapoints));
}
