import { DataType } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";

export const getDatapointThresholds = (
  dataType: DataType,
  prisma: PrismaService,
) => {
  return Promise.all([
    getUpToDateThresholds(dataType, prisma),
    getPendingThresholds(dataType, prisma),
  ])
    .then(([upToDateThreshold, pendingThreshold]) => {
      const combinedData = [upToDateThreshold, pendingThreshold];

      return combinedData;
    })
    .catch((error) => {
      // Handle any errors that occurred during retrieval
      console.error(error);
    });
};

const getUpToDateThresholds = (dataType: DataType, prisma: PrismaService) => {
  return new Promise((resolve) => {
    prisma.thresholds
      .findUnique({
        where: {
          dataType: dataType,
        },
      })
      .then((upToDateThreshold) => {
        resolve(upToDateThreshold);
      });
  });
};

const getPendingThresholds = (dataType: DataType, prisma: PrismaService) => {
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
