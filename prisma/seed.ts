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

const prisma = new PrismaClient();

async function main() {
  await Promise.all([seedDatapoints(), seedPlantSpecies()]);
}

async function seedPlantSpecies() {
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

async function seedDatapoints() {
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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
