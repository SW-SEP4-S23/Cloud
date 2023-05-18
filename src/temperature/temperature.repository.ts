import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../shared/interval-query";
import { DataType } from "@prisma/client";
import {
  findDataPointsByInterval,
  findLatestDataPoint,
} from "../shared/DataPointRepositoryUtils";
import {
  getDatapointThresholds,
  postThresholdRequest,
} from "../utils/thresholdQueryUtils";
import { NewThresholdDTO } from "../shared/newThresholdDTO";

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
