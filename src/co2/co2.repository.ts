import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../shared/interval-query";
import { NewValsDTO } from "../shared/newValsDTO";
import { DataType } from "@prisma/client";

@Injectable()
export class Co2Repository {
  constructor(private readonly prisma: PrismaService) {}

  findAllInterval(interval: IntervalQuery) {
    return this.prisma.datapoint.findMany({
      where: {
        type: DataType.CO2,
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
        dataType: DataType.CO2,
      },
      update: {},
      create: {
        dataType: DataType.CO2,
      },
    });
  }

  postThresholdRequest(newVals: NewValsDTO) {
    return this.prisma.thresholdRequest.create({
      data: {
        dataType: DataType.CO2,
        requestDate: new Date(),
        minValReq: newVals.minVal,
        maxValReq: newVals.maxVal,
      },
    });
  }
}
