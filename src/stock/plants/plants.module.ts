import { Module } from "@nestjs/common";
import { PlantsService } from "./plants.service";
import { PlantsController } from "./plants.controller";
import { PlantsRepository } from "./plants.repository";

@Module({
  providers: [PlantsService, PlantsRepository],
  controllers: [PlantsController],
})
export class PlantsModule {}
