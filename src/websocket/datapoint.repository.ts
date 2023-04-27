import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";

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
    return this.prisma.datapoint.create({
      data: { timestamp, co2, humidity, temperature },
    });
  }
}