import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { PrismaService } from "nestjs-prisma";
import { DataType } from "@prisma/client";
import { NewThresholdWrapperDTO } from "../shared/newThresholdWrapperDTO";
import { getPendingThreshold } from "../utils/thresholdQueryUtils";
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
    return Promise.all([
      this.getUpToDateThresholds(),
      this.getPendingThresholds(),
    ])
      .then(([upToDateThresholds, pendingThreshold]) => {
        const combinedData = [upToDateThresholds, pendingThreshold];

        return combinedData;
      })
      .catch((error) => {
        // Handle any errors that occurred during retrieval
        console.error(error);
      });
  }

  getUpToDateThresholds() {
    return new Promise((resolve, reject) => {
      this.prismaService.thresholds
        .findMany({})
        .then((upToDateThreshold) => {
          resolve(upToDateThreshold);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getPendingThresholds() {
    return Promise.all([
      getPendingThreshold(DataType.CO2, this.prismaService),
      getPendingThreshold(DataType.HUMIDITY, this.prismaService),
      getPendingThreshold(DataType.TEMPERATURE, this.prismaService),
    ]).then(([co2, humidity, temperature]) => {
      const pendingThresholds = [co2, humidity, temperature];
      return pendingThresholds;
    });
  }
}
