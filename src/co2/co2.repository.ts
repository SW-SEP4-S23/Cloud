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
export class Co2Repository {
  constructor(private readonly prisma: PrismaService) {}

  findAllInterval(interval: IntervalQuery) {
    return findDataPointsByInterval(
      this.prisma.datapoint,
      interval,
      DataType.CO2,
    );
  }

  findLatest() {
    return findLatestDataPoint(this.prisma.datapoint, DataType.CO2);
  }

  getDataPointThresholds() {
    return this.prisma.thresholds.findUnique({
      where: {
        dataType: DataType.CO2,
      },
    });
  }

  postThresholdRequest(newThreshold: NewThresholdDTO) {
    return this.prisma.thresholdRequests.create({
      data: {
        dataType: DataType.CO2,
        requestDate: new Date(),
        minValueReq: newThreshold.minValue,
        maxValueReq: newThreshold.maxValue,
      },
    });
  }
}
