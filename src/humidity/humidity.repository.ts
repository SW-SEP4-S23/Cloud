import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../shared/interval-query";

@Injectable()
export class HumidityRepository {
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
        humidity: true,
      },
    });
  }

  findAll() {
    return this.prisma.datapoint.findMany({
      select: {
        timestamp: true,
        humidity: true,
      },
    });
  }

  getDataPointThresholds() {
    return this.prisma.dataPointThresholds.findUnique({
      where: {
        dataType: "humidity",
      },
    });
  }

  updateThresholds(newVals) {
    return this.prisma.dataPointThresholds.update({
      where: {
        dataType: "humidity",
      },
      data: {
        minVal: newVals.minVal,
        maxVal: newVals.maxVal,
        requestDate: new Date(),
      },
    });
  }
}
