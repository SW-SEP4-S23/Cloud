import { Module } from "@nestjs/common";
import { LogsService } from "./logs.service";
import { LogsRepository } from "./logs.repository";
import { LogsController } from "./logs.controller";

@Module({
  providers: [LogsService, LogsRepository],
  controllers: [LogsController],
})
export class LogsModule {}
