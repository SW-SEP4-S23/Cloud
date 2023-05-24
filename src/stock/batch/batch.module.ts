import { Module } from "@nestjs/common";
import { BatchController } from "./batch.controller";
import { BatchRepository } from "./batch.repository";
import { BatchService } from "./batch.service";

@Module({
  providers: [BatchService, BatchRepository],
  controllers: [BatchController],
})
export class BatchModule {}
