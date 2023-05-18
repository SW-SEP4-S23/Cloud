import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../shared/interval-query";
import { NewThresholdDTO } from "../shared/newThresholdDTO";
import { DataType } from "@prisma/client";
import {
  findDataPointsByInterval,
  findLatestDataPoint,
} from "../shared/DataPointRepositoryUtils";
import {
  getDatapointThresholds,
  postThresholdRequest,
} from "../utils/thresholdQueryUtils";

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

  getDatapointThresholds() {
    return getDatapointThresholds(DataType.HUMIDITY, this.prisma);
  }

  postThresholdRequest(newThreshold: NewThresholdDTO) {
    return postThresholdRequest(DataType.HUMIDITY, newThreshold, this.prisma);
  }
}
