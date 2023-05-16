import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { DataType, PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    console.log("Initializing Prisma ORM");
    await this.$connect();
    this.seedDefaultValues();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }

  async seedDefaultValues() {
    try {
      await this.thresholds.createMany({
        data: thresholdsData,
      });

      console.log("Thresholds seeded successfully");
    } catch (error) {
      console.error("Error seeding thresholds:", error);
    }
  }
}

const thresholdsData = [
  { dataType: DataType.CO2 },
  { dataType: DataType.HUMIDITY },
  { dataType: DataType.TEMPERATURE },
];
