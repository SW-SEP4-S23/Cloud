import { Injectable } from "@nestjs/common";
import { IntervalQuery, intervalQueryChecker } from "../shared/interval-query";
import { EnvironmentRepository } from "./environment.repository";
import { allVariablesNewValsDTO } from "../shared/allVariablesNewValsDTO";
import { DataType } from "@prisma/client";

@Injectable()
export class EnvironmentService {
  constructor(private readonly environmentRepository: EnvironmentRepository) {}

  findAllInterval(interval: IntervalQuery) {
    intervalQueryChecker(interval);
    return this.environmentRepository.findAllInterval(interval);
  }

  async setNewValues(newVals: allVariablesNewValsDTO) {
    return await Promise.all([
      this.environmentRepository.setNewValues(
        DataType.TEMPERATURE,
        newVals.newTempVals,
      ),
      this.environmentRepository.setNewValues(DataType.CO2, newVals.newCo2Vals),
      this.environmentRepository.setNewValues(
        DataType.HUMIDITY,
        newVals.newHumidityVals,
      ),
    ]);
  }

  findAllThresholds() {
    return this.environmentRepository.findAllThresholds();
  }
}
