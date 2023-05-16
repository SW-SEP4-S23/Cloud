import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../shared/interval-query";
import { NewValsDTO } from "../shared/newValsDTO";
import { DataType } from "@prisma/client";

@Injectable()
export class TemperatureRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllInterval(interval: IntervalQuery) {
    return this.prisma.datapoint.findMany({
      where: {
        type: DataType.TEMPERATURE,
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

  findAll() {
    return this.prisma.datapoint.findMany({
      select: {
        timestamp: true,
        value: true,
      },
    });
  }

  getDataPointThresholds() {
    return this.prisma.thresholds.upsert({
      where: {
        dataType: DataType.TEMPERATURE,
      },
      update: {},
      create: {
        dataType: DataType.TEMPERATURE,
      },
    });
  }

  postThresholdRequest(newVals: NewValsDTO) {
    return this.prisma.thresholdRequest.create({
      data: {
        dataType: DataType.TEMPERATURE,
        requestDate: new Date(),
        minValReq: newVals.minVal,
        maxValReq: newVals.maxVal,
      },
    });
  }
}
