import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { PlantNotFoundError } from "../logs/exceptions/PlantNotFoundError";

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

  async findOne(plantId: number) {
    const data = await this.prisma.plant.findUnique({
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
    if (!data) {
      throw new PlantNotFoundError(plantId);
    }
    return data;
  }
}
