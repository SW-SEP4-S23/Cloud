import { Injectable } from "@nestjs/common";
import { IntervalQuery, intervalQueryChecker } from "../shared/interval-query";
import { EnvironmentRepository } from "./environment.repository";
import { allVariablesNewValsDTO } from "../shared/allVariablesNewValsDTO";
import { DataType } from "@prisma/client";
import { newValNullCheck } from "../shared/newValsDTO";

@Injectable()
export class EnvironmentService {
  constructor(private readonly environmentRepository: EnvironmentRepository) {}

  findAllInterval(interval: IntervalQuery) {
    intervalQueryChecker(interval);
    return this.environmentRepository.findAllInterval(interval);
  }

  async setNewValues(newVals: allVariablesNewValsDTO) {
    const promises = [];

    if (!newValNullCheck(newVals.newTempVals)) {
      promises.push(
        this.environmentRepository.setNewValues(
          DataType.TEMPERATURE,
          newVals.newTempVals,
        ),
      );
    }

    if (!newValNullCheck(newVals.newCo2Vals)) {
      promises.push(
        this.environmentRepository.setNewValues(
          DataType.CO2,
          newVals.newCo2Vals,
        ),
      );
    }

    if (!newValNullCheck(newVals.newHumidityVals)) {
      promises.push(
        this.environmentRepository.setNewValues(
          DataType.HUMIDITY,
          newVals.newHumidityVals,
        ),
      );
    }

    //Maybe
    if (promises.length === 0) {
      return [];
    }

    return Promise.all(promises);
  }

  findAllThresholds() {
    return this.environmentRepository.findAllThresholds();
  }
}
