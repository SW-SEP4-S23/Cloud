import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/dto/interval-query";
import { PrismaService } from "nestjs-prisma";
import { DataType, Thresholds } from "@prisma/client";
import { NewThresholdWrapperDTO } from "./shared/dto/new-threshold-wrapper-dto";
import { getPendingThreshold } from "./shared/query/threshold-query-utils";

@Injectable()
export class EnvironmentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findAllInterval(interval: IntervalQuery) {
    return this.prismaService.datapoint.findMany({
      where: {
        timestamp: {
          gte: interval.startDate,
          lte: interval.endDate,
        },
      },
    });
  }

  findLatest() {
    return this.prismaService.datapoint.findMany({
      take: 3, //Only works as long as we have 3 observation types. If we add/remove more, this needs to be changed
      orderBy: {
        timestamp: "desc",
      },
    });
  }

  postThresholdRequests(newThresholds: NewThresholdWrapperDTO) {
    const now = new Date();

    const data = [
      {
        dataType: DataType.CO2,
        minValueReq: newThresholds.newCo2Threshold.minValue,
        maxValueReq: newThresholds.newCo2Threshold.maxValue,
        requestDate: now,
      },
      {
        dataType: DataType.HUMIDITY,
        minValueReq: newThresholds.newHumidityThreshold.minValue,
        maxValueReq: newThresholds.newHumidityThreshold.maxValue,
        requestDate: now,
      },
      {
        dataType: DataType.TEMPERATURE,
        minValueReq: newThresholds.newTemperatureThreshold.minValue,
        maxValueReq: newThresholds.newTemperatureThreshold.maxValue,
        requestDate: now,
      },
    ];

    const filteredData = data.filter(
      (item) => item.maxValueReq !== null && item.maxValueReq !== null,
    );

    return this.prismaService.thresholdRequests.createMany({
      data: filteredData,
    });
  }

  async findAllThresholds() {
    const [upToDateThresholds, pendingThresholds] = await Promise.all([
      this.getUpToDateThresholds(),
      this.getPendingThresholds(),
    ]);

    return {
      upToDateThresholds,
      pendingThresholds,
    };
  }

async #getUpToDateThresholds() {
    const thresholds = await this.prismaService.thresholds.findMany();

    // map the thresholds to an object with the datatype as key
    const namedThresholds = thresholds.reduce((acc, curr) => {
      acc[curr.dataType] = curr;
      return acc;
    }, {} as Record<DataType, Thresholds>);

    return namedThresholds;
  }

 async #getPendingThresholds() {
    const [co2, humidity, temperature] = await Promise.all([
      getPendingThreshold(DataType.CO2, this.prismaService),
      getPendingThreshold(DataType.HUMIDITY, this.prismaService),
      getPendingThreshold(DataType.TEMPERATURE, this.prismaService),
    ]);

    return {
      co2,
      humidity,
      temperature,
    };
  }
}
