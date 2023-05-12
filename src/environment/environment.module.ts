import { Module } from "@nestjs/common";
import { EnvironmentService } from "./environment.service";
import { EnvironmentRepository } from "./environment.repository";
import { EnvironmentController } from "./environment.controller";

@Module({
  providers: [EnvironmentService, EnvironmentRepository],
  controllers: [EnvironmentController],
})
export class EnvironmentModule {}
