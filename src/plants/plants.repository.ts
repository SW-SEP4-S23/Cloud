import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class PlantsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.plant.findMany();
  }

  findOne(plantId: number) {
    return this.prisma.plant.findUnique({ where: { id: Number(plantId) } });
  }
}
