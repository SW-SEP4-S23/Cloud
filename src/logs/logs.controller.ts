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
import { SpeciesNotFoundError } from "./exceptions/SpeciesNotFoundError";

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
  async getPlantLogsByPlantId(@Param("plantId", ParseIntPipe) plantId: number) {
    try {
      return await this.logsService.getPlantLogsByPlantId(plantId);
    } catch (e) {
      switch (e.constructor) {
        case PlantNotFoundError:
          throw new HttpException(e.message, 404);
        default:
          throw new HttpException(e.message, 500);
      }
    }
  }

  @Get("/batches/:batchId/logs")
  async getBatchLogsByBatchId(@Param("batchId", ParseIntPipe) batchId: number) {
    try {
      return await this.logsService.getBatchLogsByBatchId(batchId);
    } catch (e) {
      switch (e.constructor) {
        case BatchNotFoundError:
          throw new HttpException(e.message, 404);
        default:
          throw new HttpException(e.message, 500);
      }
    }
  }

  @Get("/species/:speciesName/logs")
  async getSpeciesLogsBySpeciesName(@Param("speciesName") speciesName: string) {
    try {
      return await this.logsService.getSpeciesLogsBySpeciesName(speciesName);
    } catch (e) {
      switch (e.constructor) {
        case SpeciesNotFoundError:
          throw new HttpException(e.message, 404);
        default:
          throw new HttpException(e.message, 500);
      }
    }
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
      switch (e.constructor) {
        case PlantNotFoundError:
          throw new HttpException(e.message, 404);
        default:
          throw new HttpException(e.message, 500);
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
      switch (e.constructor) {
        case BatchNotFoundError:
          throw new HttpException(e.message, 404);
        default:
          throw new HttpException(e.message, 500);
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
      switch (e.constructor) {
        case SpeciesNotFoundError:
          throw new HttpException(e.message, 404);
        default:
          throw new HttpException(e.message, 500);
      }
    }
  }
}
