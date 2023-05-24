import {
  getDatapointThresholds,
  postThresholdRequest,
} from "../shared/query/threshold-query-utils";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../../shared/dto/interval-query";
import { DataType } from "@prisma/client";
import {
  findDataPointsByInterval,
  findLatestDataPoint,
} from "../shared/query/datapoint-repository-utils";
import { NewThresholdDTO } from "../shared/dto/new-threshold-dto";

@Injectable()
export class Co2Repository {
  constructor(private readonly prisma: PrismaService) {}

  findAllInterval(interval: IntervalQuery) {
    return findDataPointsByInterval(this.prisma, interval, DataType.CO2);
  }

  findLatest() {
    return findLatestDataPoint(this.prisma, DataType.CO2);
  }

  getDatapointThresholds() {
    return getDatapointThresholds(DataType.CO2, this.prisma);
  }

  postThresholdRequest(newThreshold: NewThresholdDTO) {
    return postThresholdRequest(DataType.CO2, newThreshold, this.prisma);
  }
}
