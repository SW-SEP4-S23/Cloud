import { Injectable } from "@nestjs/common";
import { LogsRepository } from "./logs.repository";

@Injectable()
export class LogsService {
  constructor(private readonly logsRepository: LogsRepository) {}

  getAllLogs() {
    return this.logsRepository.getAllLogs();
  }

  getAllPlantLogs() {
    return this.logsRepository.getAllPlantLogs();
  }

  getAllBatchLogs() {
    return this.logsRepository.getAllBatchLogs();
  }

  getAllSpeciesLogs() {
    return this.logsRepository.getAllSpeciesLogs();
  }

  getPlantLogsByPlantId(plantId: number) {
    return this.logsRepository.getPlantLogsByPlantId(plantId);
  }

  getBatchLogsByBatchId(batchId: number) {
    return this.logsRepository.getBatchLogsByBatchId(batchId);
  }

  getSpeciesLogsBySpeciesName(speciesName: string) {
    return this.logsRepository.getSpeciesLogsBySpeciesName(speciesName);
  }

  createPlantLog(params: { plantId: number; message: string }) {
    return this.logsRepository.createPlantLog(params);
  }

  createBatchLog(params: { batchId: number; message: string }) {
    return this.logsRepository.createBatchLog(params);
  }

  createSpeciesLog(params: { speciesName: string; message: string }) {
    return this.logsRepository.createSpeciesLog(params);
  }
}
