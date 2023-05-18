import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../shared/interval-query";
import { NewThresholdDTO } from "../shared/newThresholdDTO";
import { DataType } from "@prisma/client";
import {
  findDataPointsByInterval,
  findLatestDataPoint,
} from "../shared/DataPointRepositoryUtils";

@Injectable()
export class TemperatureRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllInterval(interval: IntervalQuery) {
    return findDataPointsByInterval(
      this.prisma.datapoint,
      interval,
      DataType.TEMPERATURE,
    );
  }

  findLatest() {
    return findLatestDataPoint(this.prisma.datapoint, DataType.TEMPERATURE);
  }

  getDataPointThresholds() {
    return this.prisma.thresholds.findUnique({
      where: {
        dataType: DataType.TEMPERATURE,
      },
    });
  }

  postThresholdRequest(newThreshold: NewThresholdDTO) {
    return this.prisma.thresholdRequests.create({
      data: {
        dataType: DataType.TEMPERATURE,
        requestDate: new Date(),
        minValueReq: newThreshold.minValue,
        maxValueReq: newThreshold.maxValue,
      },
    });
  }
}
