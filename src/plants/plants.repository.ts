import { Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
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
    try {
      return await this.prisma.plant.findUnique({
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
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        switch (e.code) {
          case "P2025":
            throw new PlantNotFoundError(plantId);
          default:
            throw e;
        }
      }
    }
  }
}
