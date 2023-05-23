import { Prisma } from "@prisma/client";

export const plantSpecies: Prisma.PlantSpeciesCreateManyInput[] = [
  {
    name: "Aloe Vera",
    OptimalCo2: 400,
    optimalHumidity: 0.5,
    optimalTemperature: 20,
  },
  {
    name: "Basil",
    OptimalCo2: 300,
    optimalHumidity: 5,
    optimalTemperature: 30,
  },
];

export const plantBatch: Prisma.PlantBatchCreateManyInput[] = [
  {
    harvestDate: new Date("2021-01-01T00:00:00.000Z").toISOString(),
    plantingDate: new Date("2020-12-01T00:00:00.000Z").toISOString(),
    ps_Name: "Aloe Vera",
    amount: 10,
  },
  {
    harvestDate: new Date("2021-01-01T00:00:00.000Z").toISOString(),
    plantingDate: new Date("2020-12-01T00:00:00.000Z").toISOString(),
    ps_Name: "Basil",
    amount: 10,
  },
];

export const plant: Prisma.PlantCreateManyInput[] = [
  {
    pb_Id: 1,
  },
  {
    pb_Id: 1,
  },
  {
    pb_Id: 2,
  },
];

export const plantLogs: Prisma.PlantLogsCreateManyInput[] = [
  {
    timestamp: new Date("2021-01-01T00:00:00.000Z").toISOString(),
    message: "Plant 1 is doing well",
    p_Id: 1,
  },
  {
    timestamp: new Date("2021-01-01T00:00:00.000Z").toISOString(),
    message: "Plant 2 is doing well",
    p_Id: 2,
  },
  {
    timestamp: new Date("2021-01-01T00:00:00.000Z").toISOString(),
    message: "Plant 3 is doing poorly",
    p_Id: 2,
  },
];

export const batchLogs: Prisma.BatchLogsCreateManyInput[] = [
  {
    timestamp: new Date("2021-01-01T00:00:00.000Z").toISOString(),
    message: "Batch 1 is doing well",
    pb_Id: 1,
  },
  {
    timestamp: new Date("2021-01-01T00:00:00.000Z").toISOString(),
    message: "Batch 2 is doing well",
    pb_Id: 2,
  },
];
