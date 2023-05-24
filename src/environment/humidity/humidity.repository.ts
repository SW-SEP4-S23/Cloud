import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../../shared/interval-query";
import { NewThresholdDTO } from "../../shared/new-threshold-dto";
import { DataType } from "@prisma/client";
import {
  findDataPointsByInterval,
  findLatestDataPoint,
} from "../../shared/datapoint-repository-utils";
import {
  getDatapointThresholds,
  postThresholdRequest,
} from "../../utils/threshold-query-utils";

@Injectable()
export class HumidityRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllInterval(interval: IntervalQuery) {
    return findDataPointsByInterval(this.prisma, interval, DataType.HUMIDITY);
  }

  findLatest() {
    return findLatestDataPoint(this.prisma, DataType.HUMIDITY);
  }

  getDatapointThresholds() {
    return getDatapointThresholds(DataType.HUMIDITY, this.prisma);
  }

  postThresholdRequest(newThreshold: NewThresholdDTO) {
    return postThresholdRequest(DataType.HUMIDITY, newThreshold, this.prisma);
  }
}
