import { Injectable } from "@nestjs/common";
import { LogsRepository } from "./logs.repository";

@Injectable()
export class LogsService {
  constructor(private readonly logsRepository: LogsRepository) {}

  async getAllLogs() {
    return this.logsRepository.getAllLogs();
  }

  async getAllPlantLogs() {
    return this.logsRepository.getAllPlantLogs();
  }

  async getAllBatchLogs() {
    return this.logsRepository.getAllBatchLogs();
  }

  async getPlantLogsByPlantId(plantId: number) {
    return this.logsRepository.getPlantLogsByPlantId(plantId);
  }

  async getBatchLogsByBatchId(batchId: number) {
    return this.logsRepository.getBatchLogsByBatchId(batchId);
  }

  async createPlantLog(params: { plantId: number; message: string }) {
    return this.logsRepository.createPlantLog(params);
  }

  async createBatchLog(params: { batchId: number; message: string }) {
    return this.logsRepository.createBatchLog(params);
  }
}
