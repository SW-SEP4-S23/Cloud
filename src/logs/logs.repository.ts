import { Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaService } from "nestjs-prisma";
import { PlantNotFoundError } from "./exceptions/PlantNotFoundError";
import { BatchNotFoundError } from "./exceptions/BatchNotFoundError";
import { SpeciesNotFoundError } from "./exceptions/SpeciesNotFoundError";

@Injectable()
export class LogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllLogs() {
    const [speciesLogs, plantLogs, batchLogs] = await Promise.all([
      this.getAllSpeciesLogs(),
      this.getAllPlantLogs(),
      this.getAllBatchLogs(),
    ]);

    return {
      speciesLogs,
      plantLogs,
      batchLogs,
    };
  }

  async getAllBatchLogs() {
    return this.prisma.batchLogs.findMany();
  }

  async getAllPlantLogs() {
    return this.prisma.plantLogs.findMany();
  }

  async getAllSpeciesLogs() {
    return this.prisma.speciesLogs.findMany();
  }

  async getPlantLogsByPlantId(plantId: number) {
    try {
      const { PlantLogs } = await this.prisma.plant.findFirstOrThrow({
        where: {
          id: plantId,
        },
        select: {
          PlantLogs: true,
        },
      });

      return PlantLogs;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        switch (e.code) {
          case "P2025":
            throw new PlantNotFoundError(plantId);
          default:
            console.log(e);
            throw e;
        }
      }
    }
  }

  async getBatchLogsByBatchId(batchId: number) {
    try {
      const { BatchLogs } = await this.prisma.plantBatch.findFirstOrThrow({
        where: {
          id: batchId,
        },
        select: {
          BatchLogs: true,
        },
      });

      return BatchLogs;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        switch (e.code) {
          case "P2025":
            throw new BatchNotFoundError(batchId);
          default:
            console.log(e);
            throw e;
        }
      }
    }
  }

  async getSpeciesLogsBySpeciesName(speciesName: string) {
    try {
      const { speciesLogs } = await this.prisma.plantSpecies.findFirstOrThrow({
        where: {
          name: speciesName,
        },
        select: {
          speciesLogs: true,
        },
      });

      return speciesLogs;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        switch (e.code) {
          case "P2025":
            throw new SpeciesNotFoundError(speciesName);
          default:
            console.log(e);
            throw e;
        }
      }
    }
  }

  async createPlantLog(params: { plantId: number; message: string }) {
    try {
      return await this.prisma.plantLogs.create({
        data: {
          p_Id: params.plantId,
          message: params.message,
          timestamp: new Date(),
        },
        select: {
          id: true,
          p_Id: true,
          message: true,
        },
      });
    } catch (e) {
      console.log(e);
      if (e instanceof PrismaClientKnownRequestError) {
        switch (e.code) {
          case "P2002":
          case "P2003":
            throw new PlantNotFoundError(params.plantId);
          default:
            console.log(e);
            throw e;
        }
      }
    }
  }

  async createBatchLog(params: { batchId: number; message: string }) {
    try {
      return await this.prisma.batchLogs.create({
        data: {
          pb_Id: params.batchId,
          message: params.message,
          timestamp: new Date(),
        },
        select: {
          id: true,
          pb_Id: true,
          message: true,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        switch (e.code) {
          case "P2002":
          case "P2003":
            throw new BatchNotFoundError(params.batchId);
          default:
            console.log(e);
            throw e;
        }
      }
    }
  }

  async createSpeciesLog(params: { speciesName: string; message: string }) {
    try {
      return await this.prisma.speciesLogs.create({
        data: {
          plantSpeciesName: params.speciesName,
          message: params.message,
          timestamp: new Date(),
        },
        select: {
          id: true,
          plantSpeciesName: true,
          message: true,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        switch (e.code) {
          case "P2002":
          case "P2003":
            throw new SpeciesNotFoundError(params.speciesName);
          default:
            console.log(e);
            throw e;
        }
      }
    }
  }
}
