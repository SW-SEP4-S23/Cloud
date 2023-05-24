import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../../../shared/dto/interval-query";
import { DataType } from "@prisma/client";

//Environment should not use these functions, since they are build for specific data types -->
export const findDataPointsByInterval = (
  prisma: PrismaService,
  IntervalQuery: IntervalQuery,
  dataType: DataType,
) => {
  return prisma.datapoint.findMany({
    where: {
      type: dataType,
      timestamp: {
        gte: IntervalQuery.startDate,
        lte: IntervalQuery.endDate,
      },
    },
    select: {
      timestamp: true,
      value: true,
    },
  });
};

export const findLatestDataPoint = (
  prisma: PrismaService,
  dataType: DataType,
) => {
  return prisma.datapoint.findFirst({
    where: {
      type: dataType,
    },
    orderBy: {
      timestamp: "desc",
    },
    take: 1,
    select: {
      timestamp: true,
      value: true,
    },
  });
};
// <--- Environment should not use these functions, since they are build for specific data types
