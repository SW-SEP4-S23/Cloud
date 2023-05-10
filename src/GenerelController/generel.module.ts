import { Controller, Module } from "@nestjs/common";
import { GenerelService } from "./generel.service";
import { GenerelRepository } from "./generel.repository";
import { PrismaService } from "../prisma.service";
import { GenerelController } from "./generel.controller";

@Module({
  providers: [GenerelService, GenerelRepository, PrismaService],
  controllers: [GenerelController],
})
export class GenerelModule {}
