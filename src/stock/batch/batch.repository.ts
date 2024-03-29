import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../../shared/dto/interval-query";
import { CreateBatch } from "./dto/create-batch";
import { PatchHarvestDate } from "./dto/patch-batch";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { SpeciesNotFoundError } from "../shared/exceptions/SpeciesNotFoundError";
import { BatchNotFoundError } from "../shared/exceptions/BatchNotFoundError";

@Injectable()
export class BatchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBatch(createBatch: CreateBatch) {
    try {
      const plantBatch = await this.prisma.plantBatch.create({
        data: {
          plantingDate: createBatch.plantingDate,
          amount: createBatch.amount,
          plantSpecies_Name: createBatch.species,
        },
      });

      const plantData = Array.from({ length: createBatch.amount }).map(() => ({
        plantBatch_Id: plantBatch.id,
      }));

      const plants = await this.prisma.plant.createMany({
        data: plantData,
      });

      return [plantBatch, plants];
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        switch (e.code) {
          case "P2003":
            throw new SpeciesNotFoundError(createBatch.species);
          default:
            throw e;
        }
      }
    }
  }

  async updateBatch(id: number, harvestDate: PatchHarvestDate) {
    try {
      return await this.prisma.plantBatch.update({
        where: {
          id: id,
        },
        data: {
          harvestDate: harvestDate.harvestDate,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        switch (e.code) {
          case "P2025":
            throw new BatchNotFoundError(id);
          default:
            throw e;
        }
      }
    }
  }

  findAll(whereCondition: HarvestedCondition) {
    return this.prisma.plantBatch.findMany({
      where: {
        ...whereCondition,
      },
    });
  }

  findAllInterval(interval: IntervalQuery, whereCondition: HarvestedCondition) {
    return this.prisma.plantBatch.findMany({
      where: {
        ...whereCondition,
        plantingDate: {
          gte: interval.startDate,
          lte: interval.endDate,
        },
      },
    });
  }

  async findOne(id: number) {
    const data = await this.prisma.plantBatch.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        plantingDate: true,
        harvestDate: true,
        plant: {},
      },
    });
    if (!data) {
      throw new BatchNotFoundError(id);
    }
    return data;
  }
}

export type HarvestedCondition =
  | {
      harvestDate: { not: null };
    }
  | {
      harvestDate: null;
    }
  | undefined;
