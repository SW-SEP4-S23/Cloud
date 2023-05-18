import { IntervalQuery } from "./interval-query";
import { DataType } from "@prisma/client";

//Environment should not use these functions, since they are build for specific data types -->
export const findDataPointsByInterval = (
  dataPoint: any,
  IntervalQuery: IntervalQuery,
  dataType: DataType,
) => {
  return dataPoint.findMany({
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

export const findLatestDataPoint = (dataPoint: any, dataType: DataType) => {
  return dataPoint.findFirst({
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
