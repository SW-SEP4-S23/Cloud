import {
  getDatapointThresholds,
  postThresholdRequest,
} from "./../utils/thresholdQueryUtils";
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

  getDatapointThresholds() {
    return getDatapointThresholds(DataType.CO2, this.prisma);
  }

  postThresholdRequest(newThreshold: NewThresholdDTO) {
    return postThresholdRequest(DataType.CO2, newThreshold, this.prisma);
  }
}
