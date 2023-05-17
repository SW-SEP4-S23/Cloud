import { DataType, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const co2 = await prisma.thresholds.upsert({
    where: {
      dataType: DataType.CO2,
    },
    update: {},
    create: {
      dataType: DataType.CO2,
    },
  });
  const temperature = await prisma.thresholds.upsert({
    where: {
      dataType: DataType.TEMPERATURE,
    },
    update: {},
    create: {
      dataType: DataType.TEMPERATURE,
    },
  });
  const humidity = await prisma.thresholds.upsert({
    where: {
      dataType: DataType.HUMIDITY,
    },
    update: {},
    create: {
      dataType: DataType.HUMIDITY,
    },
  });
  console.log({ co2, temperature, humidity });
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
