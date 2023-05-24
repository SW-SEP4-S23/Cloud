import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  ParseIntPipe,
  Param,
  Patch,
  HttpException,
} from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { BatchService } from "./batch.service";
import { CreateBatch } from "./dto/create-batch";
import { PatchHarvestDate } from "./dto/patch-batch";
import { IsHarvested } from "./dto/query-harvested";
import { BatchNotFoundError } from "../logs/exceptions/BatchNotFoundError";

@Controller("stock/batches")
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
  async findOne(@Param("id", ParseIntPipe) id: number) {
    try {
      return await this.batchService.findOne(id);
    } catch (e) {
      if (e instanceof BatchNotFoundError) {
        throw new HttpException(e.message, 404);
      }

      throw new HttpException(e.message, 500);
    }
  }

  @Patch(":id")
  async updateBatch(
    @Param("id", ParseIntPipe) id: number,
    @Body() harvestDate: PatchHarvestDate,
  ) {
    try {
      return await this.batchService.updateBatch(id, harvestDate);
    } catch (e) {
      if (e instanceof BatchNotFoundError) {
        throw new HttpException(e.message, 404);
      }

      throw new HttpException(e.message, 500);
    }
  }
}
