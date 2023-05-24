import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { PlantNotFoundError } from "../shared/exceptions/PlantNotFoundError";

@Injectable()
export class PlantsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.plant.findMany({
      include: {
        plantBatch: {
          select: {
            plantingDate: true,
            harvestDate: true,
            plantSpecies: {
              select: {
                name: true,
              },
            },
          },
        },
        plantLogs: true,
      },
    });
  }

  async findOne(plantId: number) {
    const data = await this.prisma.plant.findUnique({
      where: { id: plantId },
      include: {
        plantBatch: {
          select: {
            plantingDate: true,
            harvestDate: true,
            plantSpecies: {
              select: {
                name: true,
              },
            },
          },
        },
        plantLogs: true,
      },
    });
    if (!data) {
      throw new PlantNotFoundError(plantId);
    }
    return data;
  }
}
