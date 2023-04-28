import { Module } from "@nestjs/common";
import { HumidityService } from "./humidity.service";
import { HumidityController } from "./humidity.controller";
import { PrismaService } from "../prisma.service";
import { HumidityRepository } from "./humidity.repository";

@Module({
  providers: [HumidityService, HumidityRepository, PrismaService],
  controllers: [HumidityController],
})
export class HumidityModule {}
