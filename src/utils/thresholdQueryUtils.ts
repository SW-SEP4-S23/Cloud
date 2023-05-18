import { DataType } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { NewThresholdDTO } from "../shared/newThresholdDTO";

export const getDatapointThresholds = (
  dataType: DataType,
  prisma: PrismaService,
) => {
  return Promise.all([
    getUpToDateThreshold(dataType, prisma),
    getPendingThreshold(dataType, prisma),
  ])
    .then(([upToDateThreshold, pendingThreshold]) => {
      const combinedData = [
        { upToDateThreshold: upToDateThreshold },
        { pendingThreshold: pendingThreshold },
      ];

      return combinedData;
    })
    .catch((error) => {
      // Handle any errors that occurred during retrieval
      console.error(error);
    });
};

const getUpToDateThreshold = (dataType: DataType, prisma: PrismaService) => {
  return new Promise((resolve, reject) => {
    prisma.thresholds
      .findUnique({
        where: {
          dataType: dataType,
        },
      })
      .then((upToDateThreshold) => {
        resolve(upToDateThreshold);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getPendingThreshold = (
  dataType: DataType,
  prisma: PrismaService,
) => {
  return new Promise((resolve, reject) => {
    prisma.thresholdRequests
      .findFirst({
        where: {
          dataType: dataType,
        },
        orderBy: { requestDate: "desc" },
        select: {
          dataType: true,
          maxValueReq: true,
          minValueReq: true,
          ackId: true,
          ack: {
            select: {
              acked: true,
            },
          },
        },
      })
      .then((pendingThreshold) => {
        // Check if pendingThreshold is valid and if ack is true or false
        if (pendingThreshold) {
          if (pendingThreshold.ack == null || !pendingThreshold.ack.acked) {
            // Omitting ackId and ack from result
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { ack, ackId, ...result } = pendingThreshold;
            resolve(result);
          }
        }
        resolve(null); // No pending thresholds found
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const postThresholdRequest = (
  dataType: DataType,
  newThreshold: NewThresholdDTO,
  prisma: PrismaService,
) => {
  if (newThreshold.minValue !== null && newThreshold.maxValue !== null) {
  }
  return prisma.thresholdRequests.create({
    data: {
      dataType: dataType,
      requestDate: new Date(),
      minValueReq: newThreshold.minValue,
      maxValueReq: newThreshold.maxValue,
    },
  });
};
