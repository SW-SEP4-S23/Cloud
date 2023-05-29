import { PrismaService } from "nestjs-prisma";
import { Injectable } from "@nestjs/common";
import { DataType } from "@prisma/client";

@Injectable()
export class WebSocketRepository {
  constructor(private prisma: PrismaService) {}

  createDatapoint(params: {
    timestamp: Date;
    co2: number;
    humidity: number;
    temperature: number;
  }) {
    const { timestamp, co2, humidity, temperature } = params;
    return this.prisma.datapoint.createMany({
      data: [
        { timestamp: timestamp, type: DataType.CO2, value: co2 },
        { timestamp: timestamp, type: DataType.HUMIDITY, value: humidity },
        {
          timestamp: timestamp,
          type: DataType.TEMPERATURE,
          value: temperature,
        },
      ],
    });
  }

  getCurrentThresholds() {
    return this.prisma.thresholds.findMany({
      select: {
        dataType: true,
        maxValue: true,
        minValue: true,
      },
    });
  }

  getLatestThresholdUpdateRequests() {
    // Latest requests for all datatypes that haven't been acked
    return this.prisma.thresholdRequests.findMany({
      where: {
        OR: [
          {
            ack_Id: null,
          },
          {
            ack: {
              acked: false,
            },
          },
        ],
      },
      select: {
        id: true,
        dataType: true,
        minValueReq: true,
        maxValueReq: true,
      },
      orderBy: {
        requestDate: "desc",
      },
      distinct: ["dataType"],
    });
  }

  createAcksForThresholdUpdateRequests(
    requests: {
      id: number;
      dataType: DataType;
    }[],
  ) {
    // Create an ack (false) for the requests
    return this.prisma.ack.create({
      data: {
        acked: false,
        thresholdRequests: {
          connect: requests.map((r) => ({
            id_dataType: {
              id: r.id,
              dataType: r.dataType,
            },
          })),
        },
      },
    });
  }

  async confirmAck(ackId: number, timestamp: Date) {
    await this.prisma.ack.update({
      where: {
        id: ackId,
      },
      data: {
        acked: true,
        dateRecieved: timestamp,
      },
    });
  }

  getNewThresholdsFromRequests() {
    return this.prisma.thresholdRequests.findMany({
      where: {
        ack: {
          acked: true,
        },
      },
      select: {
        dataType: true,
        minValueReq: true,
        maxValueReq: true,
      },
      orderBy: {
        requestDate: "desc",
      },
      distinct: ["dataType"],
    });
  }

  updateThresholds(
    thresholdsRequests: {
      dataType: DataType;
      minValueReq: number;
      maxValueReq: number;
    }[],
  ) {
    return Promise.all(
      thresholdsRequests.map((t) =>
        this.prisma.thresholds.update({
          where: {
            dataType: t.dataType,
          },
          data: {
            minValue: t.minValueReq,
            maxValue: t.maxValueReq,
          },
        }),
      ),
    );
  }

  getAcksCount() {
    return this.prisma.ack.count();
  }
}
