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
    return Promise.all([this.getUpToDateThresholds, this.getPendingThresholds])
      .then(([data1, data2]) => {
        const combinedData = [data1, data2];

        return combinedData;
      })
      .catch((error) => {
        // Handle any errors that occurred during retrieval
        console.error(error);
      });
  }

  getUpToDateThresholds() {
    return new Promise((resolve) => {
      const data1 = this.prismaService.thresholds.findMany({});
      resolve(data1);
    });
  }

  getPendingThresholds() {
    return new Promise((resolve) => {
      const data2 = this.prismaService.thresholds.findMany({});
      resolve(data2);
    });
  }
}
