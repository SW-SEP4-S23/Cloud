import { Injectable } from "@nestjs/common";
import { TemperatureRepository } from "./temperature.repository";
import {
  IntervalQuery,
  validate,
  isDefined,
} from "../../shared/dto/interval-query";
import {
  NewThresholdDTO,
  newThresholdChecker,
  testForHardcodedThresholdsTemperature,
  hardcodedThresholds,
} from "../shared/dto/new-threshold-dto";

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
    testForHardcodedThresholdsTemperature(newThreshold);
    return this.temperatureRepository.postThresholdRequest(newThreshold);
  }

  getHardcodedThresholds() {
    return hardcodedThresholds.temperature;
  }
}
