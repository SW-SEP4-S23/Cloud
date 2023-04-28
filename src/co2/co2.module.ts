import { Module } from "@nestjs/common";
import { Co2Service } from "./co2.service";
import { Co2Controller } from "./co2.controller";
import { PrismaService } from "../prisma.service";
import { Co2Repository } from "./co2.repository";

@Module({
  providers: [Co2Service, Co2Repository, PrismaService],
  controllers: [Co2Controller],
})
export class Co2Module {}
