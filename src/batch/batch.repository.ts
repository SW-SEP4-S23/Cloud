import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../shared/interval-query";
import { CreateBatch } from "./dto/create-batch";
import { PatchHarvestDate } from "./dto/patch-batch";

@Injectable()
export class BatchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBatch(createBatch: CreateBatch) {
    const plantBatch = await this.prisma.plantBatch.create({
      data: {
        plantingDate: createBatch.plantingDate,
        amount: createBatch.amount,
        ps_Name: createBatch.species,
      },
    });

    const plantData = Array.from({ length: createBatch.amount }).map(() => ({
      pb_Id: plantBatch.id,
    }));

    const plants = await this.prisma.plant.createMany({
      data: plantData,
    });

    return [plantBatch, plants];
  }

  updateBatch(id: number, harvestDate: PatchHarvestDate) {
    return this.prisma.plantBatch.update({
      where: {
        id: id,
      },
      data: {
        harvestDate: harvestDate.harvestDate,
      },
    });
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

  findOne(id: number) {
    return this.prisma.plantBatch.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        plantingDate: true,
        harvestDate: true,
        Plant: {},
      },
    });
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
