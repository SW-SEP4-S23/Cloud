import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

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

  findOne(plantId: number) {
    return this.prisma.plant.findUnique({
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
  }
}
