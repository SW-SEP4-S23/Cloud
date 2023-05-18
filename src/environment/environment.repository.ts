import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { PrismaService } from "nestjs-prisma";
import { DataType } from "@prisma/client";
import { NewThresholdWrapperDTO } from "../shared/newThresholdWrapperDTO";
import { findDataPointsByInterval } from "../shared/DataPointRepositoryUtils";

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
    const data = [
      {
        dataType: DataType.CO2,
        minValueReq: newThresholds.newCo2Threshold.minValue,
        maxValueReq: newThresholds.newCo2Threshold.maxValue,
        requestDate: new Date(),
      },
      {
        dataType: DataType.HUMIDITY,
        minValueReq: newThresholds.newHumidityThreshold.minValue,
        maxValueReq: newThresholds.newHumidityThreshold.maxValue,
        requestDate: new Date(),
      },
      {
        dataType: DataType.TEMPERATURE,
        minValueReq: newThresholds.newTemperatureThreshold.minValue,
        maxValueReq: newThresholds.newTemperatureThreshold.maxValue,
        requestDate: new Date(),
      },
    ];

    const filteredData = data.filter(
      (item) => item.maxValueReq !== null && item.maxValueReq !== null,
    );

    return this.prismaService.thresholdRequests.createMany({
      data: filteredData,
    });
  }

  findAllThresholds() {
    return this.prismaService.thresholds.findMany();
  }
}
