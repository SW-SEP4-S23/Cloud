import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { PrismaService } from "nestjs-prisma";
import { DataType } from "@prisma/client";
import { NewThresholdWrapperDTO } from "../shared/newThresholdWrapperDTO";
import { getPendingThreshold } from "../utils/thresholdQueryUtils";
import { newThresholdChecker } from "../shared/newThresholdDTO";
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
    return Promise.all([
      this.getUpToDateThresholds(),
      this.getPendingThresholds(),
    ])
      .then(([upToDateThresholds, pendingThreshold]) => {
        const combinedData = {
          upToDateThresholds: upToDateThresholds,
          pendingThresholds: pendingThreshold,
        };

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
        .then((thresholds) => {
          const namedThresholds = {} as Record<
            DataType,
            { dataType: DataType; maxValue: number; minValue: number }
          >;
          thresholds.forEach((threshold) => {
            const propertyName = threshold.dataType;
            namedThresholds[propertyName] = threshold;
          });
          resolve(namedThresholds);
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
      const pendingThresholds = {
        co2: co2,
        humidity: humidity,
        temperature: temperature,
      };
      return pendingThresholds;
    });
  }
}
