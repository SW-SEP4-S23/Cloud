import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../shared/interval-query";
import { DataType } from "@prisma/client";
import {
  getDatapointThresholds,
  postThresholdRequest,
} from "../utils/thresholdQueryUtils";
import { NewThresholdDTO } from "../shared/newThresholdDTO";

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

  getDatapointThresholds() {
    return getDatapointThresholds(DataType.TEMPERATURE, this.prisma);
  }

  postThresholdRequest(newThreshold: NewThresholdDTO) {
    return postThresholdRequest(
      DataType.TEMPERATURE,
      newThreshold,
      this.prisma,
    );
  }
}
