import {
  getDatapointThresholds,
  postThresholdRequest,
} from "./../utils/thresholdQueryUtils";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../shared/interval-query";
import { NewThresholdDTO } from "../shared/newThresholdDTO";
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

  findLatest() {
    return this.prisma.datapoint.findFirst({
      where: {
        type: DataType.CO2,
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

  getDatapointThresholds() {
    return getDatapointThresholds(DataType.CO2, this.prisma);
  }

  postThresholdRequest(newThreshold: NewThresholdDTO) {
    return postThresholdRequest(DataType.CO2, newThreshold, this.prisma);
  }
}
