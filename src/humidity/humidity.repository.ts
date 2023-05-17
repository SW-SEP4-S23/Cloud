import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../shared/interval-query";
import { NewValsDTO } from "../shared/newValsDTO";
import { DataType } from "@prisma/client";

@Injectable()
export class HumidityRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllInterval(interval: IntervalQuery) {
    return this.prisma.datapoint.findMany({
      where: {
        type: DataType.HUMIDITY,
        timestamp: {
          gte: interval.startDate,
          lte: interval.endDate,
        },
      },
      select: {
        timestamp: true,
        value: true,
      },
    });
  }

  findLatest() {
    return this.prisma.datapoint.findFirst({
      where: {
        type: DataType.HUMIDITY,
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 1,
      select: {
        timestamp: true,
        value: true,
      },
    });
  }

  findAll() {
    return this.prisma.datapoint.findMany({
      select: {
        timestamp: true,
        value: true,
      },
    });
  }

  getDataPointThresholds() {
    return this.prisma.dataPointThresholds.findUnique({
      where: {
        dataType: DataType.HUMIDITY,
      },
    });
  }

  updateThresholds(newVals: NewValsDTO) {
    return this.prisma.dataPointThresholds.upsert({
      where: {
        dataType: DataType.HUMIDITY,
      },
      update: {
        minVal: newVals.minVal,
        maxVal: newVals.maxVal,
        requestDate: new Date(),
      },
      create: {
        dataType: DataType.HUMIDITY,
        minVal: newVals.minVal,
        maxVal: newVals.maxVal,
        requestDate: new Date(),
      },
    });
  }
}
