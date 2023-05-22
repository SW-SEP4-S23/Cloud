import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { LogsService } from "./logs.service";
import { CreatePlantLogDto } from "./dto/create-plant-log-dto";
import { CreateBatchLogDto } from "./dto/create-batch-log-dto";

@Controller("stock")
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get("/logs")
  getAllLogs() {
    return this.logsService.getAllLogs();
  }

  @Get("/plants/logs")
  getAllPlantLogs() {
    return this.logsService.getAllPlantLogs();
  }

  @Get("/batches/logs")
  getAllBatchLogs() {
    return this.logsService.getAllBatchLogs();
  }

  @Get("/plants/:plantId/logs")
  getPlantLogsByPlantId(@Param("plantId", ParseIntPipe) plantId: number) {
    return this.logsService.getPlantLogsByPlantId(plantId);
  }

  @Get("/batches/:batchId/logs")
  getBatchLogsByBatchId(@Param("batchId", ParseIntPipe) batchId: number) {
    return this.logsService.getBatchLogsByBatchId(batchId);
  }

  @Post("/plants/:plantId/logs")
  createPlantLog(
    @Param("plantId", ParseIntPipe) plantId: number,
    @Body() createPlantLogDto: CreatePlantLogDto,
  ) {
    return this.logsService.createPlantLog({
      plantId,
      message: createPlantLogDto.message,
    });
  }

  @Post("/batches/:batchId/logs")
  createBatchLog(
    @Param("batchId", ParseIntPipe) batchId: number,
    @Body() createBatchLogDto: CreateBatchLogDto,
  ) {
    return this.logsService.createBatchLog({
      batchId,
      message: createBatchLogDto.message,
    });
  }
}
