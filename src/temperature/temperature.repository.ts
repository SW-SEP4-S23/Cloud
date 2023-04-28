import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { IntervalQuery } from "../shared/interval-query";

@Injectable()
export class TemperatureRepository {
  constructor(private readonly prisma: PrismaService) {}
  findAllInterval(interval: IntervalQuery) {
    return this.prisma.datapoint.findMany({
      where: {
        timestamp: {
          gte: interval.startDate,
          lte: interval.endDate,
        },
      },
      select: {
        timestamp: true,
        temperature: true,
      },
    });
  }

  findAll() {
    return this.prisma.datapoint.findMany({
      select: {
        timestamp: true,
        temperature: true,
      },
    });
  }
}
