import { SpeciesService } from "./species.service";
import { Module } from "@nestjs/common";
import { SpeciesRepository } from "./species.repository";
import { SpeciesController } from "./species.controller";

@Module({
  providers: [SpeciesRepository, SpeciesService],
  controllers: [SpeciesController],
})
export class SpeciesModule {}
