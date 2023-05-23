import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  ParseIntPipe,
  Param,
  Patch,
} from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { BatchService } from "./batch.service";
import { CreateBatch } from "./dto/create-batch";
import { PatchHarvestDate } from "./dto/patch-batch";
import { IsHarvested } from "./dto/query-harvested";

@Controller("stock/batch")
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  createBatch(@Body() createBatch: CreateBatch) {
    return this.batchService.createBatch(createBatch);
  }

  @Get()
  getBatch(
    @Query() interval?: IntervalQuery,
    @Query() harvested?: IsHarvested,
  ) {
    return this.batchService.getBatch(interval, harvested);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.batchService.findOne(id);
  }

  @Patch(":id")
  updateBatch(
    @Param("id", ParseIntPipe) id: number,
    @Body() harvestDate: PatchHarvestDate,
  ) {
    return this.batchService.updateBatch(id, harvestDate);
  }
}
