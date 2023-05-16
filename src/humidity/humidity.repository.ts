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
    return this.prisma.thresholds.upsert({
      where: {
        dataType: DataType.HUMIDITY,
      },
      update: {},
      create: {
        dataType: DataType.HUMIDITY,
      },
    });
  }

  postThresholdRequest(newVals: NewValsDTO) {
    return this.prisma.thresholdRequest.create({
      data: {
        dataType: DataType.HUMIDITY,
        requestDate: new Date(),
        minValReq: newVals.minVal,
        maxValReq: newVals.maxVal,
      },
    });
  }
}
