import { Injectable } from "@nestjs/common";
import { TemperatureRepository } from "./temperature.repository";
import { NewValsDTO, newValsDTOChecker } from "../shared/newValsDTO";
import { IntervalQuery, validate, isDefined } from "../shared/interval-query";

@Injectable()
export class TemperatureService {
  constructor(private readonly temperatureRepository: TemperatureRepository) {}

  findAllInterval(interval: IntervalQuery) {
    if (!isDefined(interval)) return this.temperatureRepository.findLatest();
    validate(interval);
    return this.temperatureRepository.findAllInterval(interval);
  }

  getDataPointThresholds() {
    return this.temperatureRepository.getDataPointThresholds();
  }

  updateThresholds(newVals: NewValsDTO) {
    newValsDTOChecker(newVals);
    return this.temperatureRepository.updateThresholds(newVals);
  }
}
