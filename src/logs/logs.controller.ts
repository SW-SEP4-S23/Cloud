import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
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

  @Get("/species/logs")
  getAllSpeciesLogs() {
    return this.logsService.getAllSpeciesLogs();
  }

  @Get("/plants/:plantId/logs")
  async getPlantLogsByPlantId(@Param("plantId") plantId: number) {
    try {
      return await this.logsService.getPlantLogsByPlantId(plantId);
    } catch (e) {
      if (e instanceof PlantNotFoundError) {
        throw new HttpException(e.message, 404);
      }
    }
  }

  @Get("/batches/:batchId/logs")
  async getBatchLogsByBatchId(@Param("batchId") batchId: number) {
    try {
      return await this.logsService.getBatchLogsByBatchId(batchId);
    } catch (e) {
      if (e instanceof BatchNotFoundError) {
        throw new HttpException(e.message, 404);
      }
    }
  }

  @Get("/species/:speciesName/logs")
  async getSpeciesLogsBySpeciesName(@Param("speciesName") speciesName: string) {
    try {
      return await this.logsService.getSpeciesLogsBySpeciesName(speciesName);
    } catch (e) {
      if (e instanceof BatchNotFoundError) {
        throw new HttpException(e.message, 404);
      }
    }
  }

  @Post("/plants/:plantId/logs")
  async createPlantLog(
    @Param("plantId") plantId: number,
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
    @Param("batchId") batchId: number,
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

  @Post("/species/:speciesName/logs")
  async createSpeciesLog(
    @Param("speciesName") speciesName: string,
    @Body() createSpeciesLogDto: CreateBatchLogDto,
  ) {
    try {
      return await this.logsService.createSpeciesLog({
        speciesName,
        message: createSpeciesLogDto.message,
      });
    } catch (e) {
      if (e instanceof BatchNotFoundError) {
        throw new HttpException(e.message, 404);
      }
    }
  }
}
