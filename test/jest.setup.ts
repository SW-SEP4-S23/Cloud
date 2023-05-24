import { PrismaClient } from "@prisma/client";
import { seedDatabase, undoSeedDatabase } from "../prisma/seeding-functions";

const prisma = new PrismaClient();

beforeAll(async () => {
  await seedDatabase(prisma);
});

afterAll(async () => {
  await undoSeedDatabase(prisma);
  await prisma.$disconnect();
});
