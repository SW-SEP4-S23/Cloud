import { Module } from "@nestjs/common";
import { HumidityService } from "./humidity.service";
import { HumidityController } from "./humidity.controller";
import { HumidityRepository } from "./humidity.repository";

@Module({
  providers: [HumidityService, HumidityRepository],
  controllers: [HumidityController],
})
export class HumidityModule {}
