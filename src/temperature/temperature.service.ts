import { Injectable } from "@nestjs/common";
import { TemperatureRepository } from "./temperature.repository";
import { IntervalQuery, validate, isDefined } from "../shared/interval-query";
import {
  NewThresholdDTO,
  newThresholdChecker,
} from "../shared/newThresholdDTO";

@Injectable()
export class TemperatureService {
  constructor(private readonly temperatureRepository: TemperatureRepository) {}

  findAllInterval(interval: IntervalQuery) {
    if (!isDefined(interval)) return this.temperatureRepository.findLatest();
    validate(interval);
    return this.temperatureRepository.findAllInterval(interval);
  }

  getDataPointThresholds() {
    return this.temperatureRepository.getDatapointThresholds();
  }

  postThresholdRequest(newThreshold: NewThresholdDTO) {
    newThresholdChecker(newThreshold);
    return this.temperatureRepository.postThresholdRequest(newThreshold);
  }
}
