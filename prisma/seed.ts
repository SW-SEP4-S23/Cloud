import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const datapoints = await prisma.datapoint.createMany({
    data: [
      {
        timestamp: new Date("2021-01-01T00:00:00.000Z"),
        co2: 400,
        humidity: 0.5,
        temperature: 20,
      },
      {
        timestamp: new Date("2021-01-01T00:05:00.000Z"),
        co2: 500,
        humidity: 0.6,
        temperature: 22,
      },
      {
        timestamp: new Date("2021-01-01T00:10:00.000Z"),
        co2: 600,
        humidity: 0.7,
        temperature: 24,
      },
      {
        timestamp: new Date("2021-01-01T00:15:00.000Z"),
        co2: 700,
        humidity: 0.8,
        temperature: 26,
      },
      {
        timestamp: new Date("2021-01-01T00:20:00.000Z"),
        co2: 800,
        humidity: 0.9,
        temperature: 28,
      },
      {
        timestamp: new Date("2021-01-01T00:25:00.000Z"),
        co2: 900,
        humidity: 1.0,
        temperature: 30,
      },
      {
        timestamp: new Date("2021-01-01T00:30:00.000Z"),
        co2: 1000,
        humidity: 1.1,
        temperature: 32,
      },
      {
        timestamp: new Date("2021-01-01T00:35:00.000Z"),
        co2: 1100,
        humidity: 1.2,
        temperature: 34,
      },
      {
        timestamp: new Date("2021-01-01T00:40:00.000Z"),
        co2: 1200,
        humidity: 1.3,
        temperature: 36,
      },
      {
        timestamp: new Date("2021-01-01T00:45:00.000Z"),
        co2: 1300,
        humidity: 1.4,
        temperature: 38,
      },
      {
        timestamp: new Date("2021-01-01T00:50:00.000Z"),
        co2: 1400,
        humidity: 1.5,
        temperature: 40,
      },
      {
        timestamp: new Date("2021-01-01T00:55:00.000Z"),
        co2: 1500,
        humidity: 1.6,
        temperature: 42,
      },
      {
        timestamp: new Date("2021-01-01T01:00:00.000Z"),
        co2: 1600,
        humidity: 1.7,
        temperature: 44,
      },
      {
        timestamp: new Date("2021-01-01T01:05:00.000Z"),
        co2: 1700,
        humidity: 1.8,
        temperature: 46,
      },
      {
        timestamp: new Date("2021-01-01T01:10:00.000Z"),
        co2: 1800,
        humidity: 1.9,
        temperature: 48,
      },
      {
        timestamp: new Date("2021-01-01T01:15:00.000Z"),
        co2: 1900,
        humidity: 2.0,
        temperature: 50,
      },
      {
        timestamp: new Date("2021-01-01T01:20:00.000Z"),
        co2: 2000,
        humidity: 2.1,
        temperature: 52,
      },
      {
        timestamp: new Date("2021-01-01T01:25:00.000Z"),
        co2: 2100,
        humidity: 2.2,
        temperature: 54,
      },
      {
        timestamp: new Date("2021-01-01T01:30:00.000Z"),
        co2: 2200,
        humidity: 2.3,
        temperature: 56,
      },
      {
        timestamp: new Date("2021-01-01T01:35:00.000Z"),
        co2: 2300,
        humidity: 2.4,
        temperature: 58,
      },
      {
        timestamp: new Date("2021-01-01T01:40:00.000Z"),
        co2: 2400,
        humidity: 2.5,
        temperature: 60,
      },
    ],
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
