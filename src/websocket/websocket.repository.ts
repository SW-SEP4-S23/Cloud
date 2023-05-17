import { PrismaService } from "nestjs-prisma";
import { Injectable } from "@nestjs/common";
import { DataType } from "@prisma/client";

@Injectable()
export class WebSocketRepository {
  constructor(private prisma: PrismaService) {}

  async createDatapoint(params: {
    timestamp: Date;
    co2: number;
    humidity: number;
    temperature: number;
  }) {
    const { timestamp, co2, humidity, temperature } = params;
    return this.prisma.datapoint.create({
      data: { timestamp, co2, humidity, temperature },
    });
  }

  async getLatestThresholdUpdateRequests() {
    // TODO
    // Latest requests for all datatypes that haven't been acked
  }

  async setThresholdUpdateRequestsToBePending() {
    // TODO
    // Create an ack (false) for the requests
  }

  async setAckToTrue() {
    // TODO
    // Set the ack to true for the requests
  }

  async getAcksCount() {
    // TODO
    // Get the number of acks
  }

  async setThresholdsDateChanged(timestamp: Date) {
    return this.prisma.dataPointThresholds.updateMany({
      data: { dateChanged: timestamp },
    });
  }
}
