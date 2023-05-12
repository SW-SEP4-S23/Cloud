import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { IntervalQuery } from "../shared/interval-query";

@Injectable()
export class Co2Repository {
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
        co2: true,
      },
    });
  }

  findAll() {
    return this.prisma.datapoint.findMany({
      select: {
        timestamp: true,
        co2: true,
      },
    });
  }

  updateThresholds(newVals) {
    return this.prisma.dataPointThresholds.update({
      where: {
        dataType: "co2",
      },
      data: {
        minVal: newVals.minVal,
        maxVal: newVals.maxVal,
        requestDate: new Date(),
      },
    });
  }
}
