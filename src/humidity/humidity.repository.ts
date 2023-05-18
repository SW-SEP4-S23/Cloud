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
export class HumidityRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllInterval(interval: IntervalQuery) {
    return findDataPointsByInterval(
      this.prisma.datapoint,
      interval,
      DataType.HUMIDITY,
    );
  }

  findLatest() {
    return findLatestDataPoint(this.prisma.datapoint, DataType.HUMIDITY);
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
        minValueReq: newThreshold.minValue,
        maxValueReq: newThreshold.maxValue,
      },
    });
  }
}
