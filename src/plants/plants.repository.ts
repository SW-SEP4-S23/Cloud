import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class PlantsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.plant.findMany({
      include: {
        pb: {
          select: {
            plantingDate: true,
            harvestDate: true,
            ps: {
              select: {
                name: true,
              },
            },
          },
        },
        PlantLogs: true,
      },
    });
  }

  findOne(plantId: number) {
    return this.prisma.plant.findUnique({
      where: { id: plantId },
      include: {
        pb: {
          select: {
            plantingDate: true,
            harvestDate: true,
            ps: {
              select: {
                name: true,
              },
            },
          },
        },
        PlantLogs: true,
      },
    });
  }
}
