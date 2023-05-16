import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { PrismaService } from "nestjs-prisma";
import { DataType } from "@prisma/client";
import { allVariablesNewValsDTO } from "../shared/allVariablesNewValsDTO";

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

  postThresholdRequests(newVals: allVariablesNewValsDTO) {
    const data = [
      {
        dataType: DataType.CO2,
        minValReq: newVals.newCo2Vals.minVal,
        maxValReq: newVals.newCo2Vals.maxVal,
        requestDate: new Date(),
      },
      {
        dataType: DataType.HUMIDITY,
        minValReq: newVals.newCo2Vals.minVal,
        maxValReq: newVals.newCo2Vals.maxVal,
        requestDate: new Date(),
      },
      {
        dataType: DataType.TEMPERATURE,
        minValReq: newVals.newTempVals.minVal,
        maxValReq: newVals.newTempVals.maxVal,
        requestDate: new Date(),
      },
    ];

    const filteredData = data.filter(
      (item) => item.minValReq !== null && item.maxValReq !== null,
    );

    return this.prismaService.thresholdRequest.createMany({
      data: filteredData,
    });
  }

  findAllThresholds() {
    return this.prismaService.thresholds.findMany();
  }
}
