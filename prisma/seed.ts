import { PrismaClient } from "@prisma/client";
import { DataType } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const data = [];

  const iterations = 21; //nr of DataPoint for each sensor
  const startDate = new Date("2021-01-01T00:00:00.000Z");

  // !Might need change if we limit the range of the data
  let co2 = 400;
  let humidity = 0.5;
  let temperature = 20;

  for (let i = 0; i < iterations; i++) {
    data.push({
      timestamp: startDate,
      type: DataType.CO2,
      value: co2,
    });
    data.push({
      timestamp: startDate,
      type: DataType.HUMIDITY,
      value: humidity,
    });
    data.push({
      timestamp: startDate,
      type: DataType.TEMPERATURE,
      value: temperature,
    });

    startDate.setMinutes(startDate.getMinutes() + 5);
    co2 += 100;
    humidity += 0.1;
    temperature += 2;
  }
  console.log("Creating: " + JSON.stringify(data));
  const datapoints = await prisma.datapoint.createMany({
    data,
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
