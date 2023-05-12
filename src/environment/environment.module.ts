import { Module } from "@nestjs/common";
import { EnvironmentService } from "./environment.service";
import { EnvironmentRepository } from "./environment.repository";
import { PrismaService } from "../prisma.service";
import { EnvironmentController } from "./environment.controller";

@Module({
  providers: [EnvironmentService, EnvironmentRepository, PrismaService],
  controllers: [EnvironmentController],
})
export class EnvironmentModule {}
