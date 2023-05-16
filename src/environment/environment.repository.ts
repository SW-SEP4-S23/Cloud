import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { PrismaService } from "nestjs-prisma";
import { DataType } from "@prisma/client";
import { NewThresholdWrapperDTO } from "../shared/newThresholdWrapperDTO";

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

  postThresholdRequests(newThresholds: NewThresholdWrapperDTO) {
    const data = [
      {
        dataType: DataType.CO2,
        minValReq: newThresholds.newCo2Threshold.minValue,
        maxValReq: newThresholds.newCo2Threshold.maxValue,
        requestDate: new Date(),
      },
      {
        dataType: DataType.HUMIDITY,
        minValReq: newThresholds.newHumidityThreshold.minValue,
        maxValReq: newThresholds.newHumidityThreshold.maxValue,
        requestDate: new Date(),
      },
      {
        dataType: DataType.TEMPERATURE,
        minValReq: newThresholds.newTemperatureThreshold.minValue,
        maxValReq: newThresholds.newTemperatureThreshold.maxValue,
        requestDate: new Date(),
      },
    ];

    const filteredData = data.filter(
      (item) => item.minValReq !== null && item.maxValReq !== null,
    );

    return this.prismaService.thresholdRequests.createMany({
      data: filteredData,
    });
  }

  findAllThresholds() {
    return this.prismaService.thresholds.findMany();
  }
}
