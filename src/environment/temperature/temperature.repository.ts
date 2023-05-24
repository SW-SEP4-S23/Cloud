import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../../shared/dto/interval-query";
import { DataType } from "@prisma/client";
import {
  findDataPointsByInterval,
  findLatestDataPoint,
} from "../shared/query/datapoint-repository-utils";
import {
  getDatapointThresholds,
  postThresholdRequest,
} from "../shared/query/threshold-query-utils";
import { NewThresholdDTO } from "../shared/dto/new-threshold-dto";

@Injectable()
export class TemperatureRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllInterval(interval: IntervalQuery) {
    return findDataPointsByInterval(
      this.prisma,
      interval,
      DataType.TEMPERATURE,
    );
  }

  findLatest() {
    return findLatestDataPoint(this.prisma, DataType.TEMPERATURE);
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
