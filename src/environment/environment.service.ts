import { Injectable } from "@nestjs/common";
import { IntervalQuery, validate, isDefined } from "../shared/interval-query";
import { EnvironmentRepository } from "./environment.repository";
import { allVariablesNewValsDTO } from "../shared/allVariablesNewValsDTO";
import { DataType } from "@prisma/client";

@Injectable()
export class EnvironmentService {
  constructor(private readonly environmentRepository: EnvironmentRepository) {}

  async findAllInterval(interval: IntervalQuery) {
    if (!isDefined(interval))
      return await this.environmentRepository.findLatest();

    validate(interval);

    const data = await this.environmentRepository.findAllInterval(interval);
    const sortedData = {};
    //sorts the result from data base into an object with the type as key and the values as an array of objects with timestamp and value
    data.forEach((d) => {
      if (!sortedData[d.type]) {
        sortedData[d.type] = [];
      }
      sortedData[d.type].push({
        timestamp: d.timestamp,
        value: d.value,
      });
    });

    return sortedData;
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
