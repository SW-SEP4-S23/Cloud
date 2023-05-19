import { DataType } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { NewThresholdDTO } from "../shared/newThresholdDTO";

export const getDatapointThresholds = async (
  dataType: DataType,
  prisma: PrismaService,
) => {
  const [upToDateThreshold, pendingThreshold] = await Promise.all([
    getUpToDateThreshold(dataType, prisma),
    getPendingThreshold(dataType, prisma),
  ]);

  return {
    upToDateThreshold,
    pendingThreshold,
  };
};

const getUpToDateThreshold = (dataType: DataType, prisma: PrismaService) => {
  return prisma.thresholds.findUnique({
    where: {
      dataType,
    },
  });
};

export const getPendingThreshold = async (
  dataType: DataType,
  prisma: PrismaService,
) => {
  try {
    const pendingThreshold = await prisma.thresholdRequests.findFirstOrThrow({
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
    });

    if (pendingThreshold.ack == null || !pendingThreshold.ack.acked) {
      // Omitting ackId and ack from result
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ackId, ack, ...result } = pendingThreshold;
      return result;
    }
  } catch {
    console.info("No pending threshold found");
  }
};

export const postThresholdRequest = (
  dataType: DataType,
  newThreshold: NewThresholdDTO,
  prisma: PrismaService,
) => {
  if (newThreshold.minValue !== null && newThreshold.maxValue !== null) {
    return prisma.thresholdRequests.create({
      data: {
        dataType: dataType,
        requestDate: new Date(),
        minValueReq: newThreshold.minValue,
        maxValueReq: newThreshold.maxValue,
      },
    });
  }
};
