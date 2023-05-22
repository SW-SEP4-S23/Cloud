import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { LogsService } from "./logs.service";
import { CreatePlantLogDto } from "./dto/create-plant-log-dto";
import { CreateBatchLogDto } from "./dto/create-batch-log-dto";
import { BatchNotFoundError } from "./exceptions/BatchNotFoundError";
import { PlantNotFoundError } from "./exceptions/PlantNotFoundError";

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
  async createPlantLog(
    @Param("plantId", ParseIntPipe) plantId: number,
    @Body() createPlantLogDto: CreatePlantLogDto,
  ) {
    try {
      return await this.logsService.createPlantLog({
        plantId,
        message: createPlantLogDto.message,
      });
    } catch (e) {
      if (e instanceof PlantNotFoundError) {
        throw new HttpException(e.message, 404);
      }
    }
  }

  @Post("/batches/:batchId/logs")
  async createBatchLog(
    @Param("batchId", ParseIntPipe) batchId: number,
    @Body() createBatchLogDto: CreateBatchLogDto,
  ) {
    try {
      return await this.logsService.createBatchLog({
        batchId,
        message: createBatchLogDto.message,
      });
    } catch (e) {
      if (e instanceof BatchNotFoundError) {
        throw new HttpException(e.message, 404);
      }
    }
  }
}
