import { Module } from "@nestjs/common";
import { TemperatureService } from "./temperature.service";
import { TemperatureController } from "./temperature.controller";
import { PrismaService } from "../prisma.service";
import { TemperatureRepository } from "./temperature.repository";

@Module({
  providers: [TemperatureService, TemperatureRepository, PrismaService],
  controllers: [TemperatureController],
})
export class TemperatureModule {}
