import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { PrismaService } from "../prisma.service";
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

  setNewValues(newVals: allVariablesNewValsDTO) {
    return this.prismaService.dataPointThreshholds.updateMany({
      update: {
        minVal: newVals.
      }
    });
  }
}
