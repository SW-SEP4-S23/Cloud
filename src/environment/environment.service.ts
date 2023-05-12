import { Injectable } from "@nestjs/common";
import { IntervalQuery, intervalQueryChecker } from "../shared/interval-query";
import { EnvironmentRepository } from "./environment.repository";
import { allVariablesNewValsDTO } from "../shared/allVariablesNewValsDTO";

@Injectable()
export class EnvironmentService {
  constructor(private readonly environmentRepository: EnvironmentRepository) {}

  findAllInterval(interval: IntervalQuery) {
    intervalQueryChecker(interval);
    return this.environmentRepository.findAllInterval(interval);
  }

  async setNewValues(newVals: allVariablesNewValsDTO) {
    await Promise.all([
      this.environmentRepository.setNewValues(
        `temperature`,
        newVals.newTempVals,
      ),
      this.environmentRepository.setNewValues(`co2`, newVals.newCo2Vals),
      this.environmentRepository.setNewValues(
        `humidity`,
        newVals.newHumidityVals,
      ),
    ]);
  }

  findAllThresholds() {
    return this.environmentRepository.findAllThresholds();
  }
}
