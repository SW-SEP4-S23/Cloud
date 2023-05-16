import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../shared/interval-query";
import { NewThresholdDTO } from "../shared/newThresholdDTO";
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
    return this.prisma.thresholds.findUnique({
      where: {
        dataType: DataType.HUMIDITY,
      },
    });
  }

  postThresholdRequest(newThreshold: NewThresholdDTO) {
    return this.prisma.thresholdRequests.create({
      data: {
        dataType: DataType.HUMIDITY,
        requestDate: new Date(),
        minValReq: newThreshold.minValue,
        maxValReq: newThreshold.maxValue,
      },
    });
  }
}
