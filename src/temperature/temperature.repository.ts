import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../shared/interval-query";
import { NewValsDTO } from "../shared/newValsDTO";

@Injectable()
export class TemperatureRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllInterval(interval: IntervalQuery) {
    return this.prisma.datapoint.findMany({
      where: {
        timestamp: {
          gte: interval.startDate,
          lte: interval.endDate,
        },
      },
      select: {
        timestamp: true,
        temperature: true,
      },
    });
  }

  findAll() {
    return this.prisma.datapoint.findMany({
      select: {
        timestamp: true,
        temperature: true,
      },
    });
  }

  getDataPointThresholds() {
    return this.prisma.dataPointThresholds.findUnique({
      where: {
        dataType: "temperature",
      },
    });
  }

  updateThresholds(newVals: NewValsDTO) {
    console.log(newVals);
    return this.prisma.dataPointThresholds.upsert({
      where: {
        dataType: "temperature",
      },
      update: {
        minVal: newVals.minVal,
        maxVal: newVals.maxVal,
        requestDate: new Date(),
      },
      create: {
        dataType: "temperature",
        minVal: newVals.minVal,
        maxVal: newVals.maxVal,
        requestDate: new Date(),
      },
    });
  }
}
