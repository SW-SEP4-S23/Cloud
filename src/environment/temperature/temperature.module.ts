import { Module } from "@nestjs/common";
import { TemperatureService } from "./temperature.service";
import { TemperatureController } from "./temperature.controller";
import { TemperatureRepository } from "./temperature.repository";

@Module({
  providers: [TemperatureService, TemperatureRepository],
  controllers: [TemperatureController],
})
export class TemperatureModule {}
