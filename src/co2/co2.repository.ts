import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IntervalQuery } from "../shared/interval-query";
import { NewThresholdDTO } from "../shared/newThresholdDTO";
import { DataType } from "@prisma/client";

@Injectable()
export class Co2Repository {
  constructor(private readonly prisma: PrismaService) {}

  findAllInterval(interval: IntervalQuery) {
    return this.prisma.datapoint.findMany({
      where: {
        type: DataType.CO2,
        timestamp: {
          gte: interval.startDate,
          lte: interval.endDate,
        },
      },
      select: {
        timestamp: true,
        value: true,
      },
    });
  }

  findAll() {
    return this.prisma.datapoint.findMany({
      select: {
        timestamp: true,
        value: true,
      },
    });
  }

  async getDatapointThresholds() {
    return await Promise.all([
      this.getUpToDateThresholds(),
      this.getPendingThresholds(),
    ])
      .then(([upToDateThreshold, pendingThreshold]) => {
        const combinedData = [upToDateThreshold, pendingThreshold];

        return combinedData;
      })
      .catch((error) => {
        // Handle any errors that occurred during retrieval
        console.error(error);
      });
  }

  getUpToDateThresholds() {
    return new Promise((resolve) => {
      this.prisma.thresholds
        .findUnique({
          where: {
            dataType: DataType.CO2,
          },
        })
        .then((upToDateThreshold) => {
          resolve(upToDateThreshold);
        });
    });
  }

  getPendingThresholds() {
    return new Promise((resolve, reject) => {
      this.prisma.thresholdRequests
        .findFirst({
          where: {
            dataType: DataType.CO2,
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
          if (pendingThreshold.ackId == null || !pendingThreshold.ack.acked) {
            //Omitting ackId and ack from result
            const { ackId, ack, ...result } = pendingThreshold;
            resolve(result);
          } else {
            resolve(null); // No pending thresholds found
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  postThresholdRequest(newThreshold: NewThresholdDTO) {
    return this.prisma.thresholdRequests.create({
      data: {
        dataType: DataType.CO2,
        requestDate: new Date(),
        minValueReq: newThreshold.minValue,
        maxValueReq: newThreshold.maxValue,
      },
    });
  }
}
