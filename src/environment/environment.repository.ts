import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { PrismaService } from "../prisma.service";
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

  async setNewValues(dataType: string, newVals: NewValsDTO) {
    const type: DataType = DataType[dataType];
    await this.prismaService.dataPointThresholds.upsert({
      where: { dataType: type },
      update: {
        minVal: newVals.minVal,
        maxVal: newVals.maxVal,
        requestDate: new Date(),
      },
      create: {
        dataType: type,
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
