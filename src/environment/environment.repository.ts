import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { PrismaService } from "nestjs-prisma";
import { NewValsDTO } from "../shared/newValsDTO";
import { DataType } from "@prisma/client";

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

  async setNewValues(dataType: DataType, newVals: NewValsDTO) {
    await this.prismaService.dataPointThresholds.upsert({
      where: { dataType: dataType },
      update: {
        minVal: newVals.minVal,
        maxVal: newVals.maxVal,
        requestDate: new Date(),
      },
      create: {
        dataType: dataType,
        minVal: newVals.minVal,
        maxVal: newVals.maxVal,
        requestDate: new Date(),
      },
    });
  }

  findAllThresholds() {
    return this.prismaService.dataPointThresholds.findMany();
  }
}
