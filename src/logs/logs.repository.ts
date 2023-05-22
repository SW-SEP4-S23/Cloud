import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class LogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllBatchLogs() {
    return this.prisma.batchLogs.findMany();
  }

  async getAllPlantLogs() {
    return this.prisma.plantLogs.findMany();
  }

  async getAllLogs() {
    const [plantLogs, batchLogs] = await Promise.all([
      this.getAllPlantLogs(),
      this.getAllBatchLogs(),
    ]);

    return {
      plantLogs,
      batchLogs,
    };
  }

  async getPlantLogsByPlantId(plantId: number) {
    return this.prisma.plantLogs.findMany({
      where: {
        p_Id: plantId,
      },
    });
  }

  async getBatchLogsByBatchId(batchId: number) {
    return this.prisma.batchLogs.findMany({
      where: {
        pb_Id: batchId,
      },
    });
  }

  async createPlantLog(params: { plantId: number; message: string }) {
    return this.prisma.plantLogs.create({
      data: {
        p_Id: params.plantId,
        message: params.message,
        timestamp: new Date(),
      },
    });
  }

  async createBatchLog(params: { batchId: number; message: string }) {
    return this.prisma.batchLogs.create({
      data: {
        pb_Id: params.batchId,
        message: params.message,
        timestamp: new Date(),
      },
    });
  }
}
