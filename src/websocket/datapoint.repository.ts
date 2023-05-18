import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { DataType } from "@prisma/client";

@Injectable()
export class DatapointRepository {
  constructor(private prisma: PrismaService) {}

  async createDatapoint(params: {
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
}
