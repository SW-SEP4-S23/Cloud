import { Injectable } from "@nestjs/common";
import {
  IntervalQuery,
  validate,
  isDefined,
} from "../../shared/dto/interval-query";
import { HumidityRepository } from "./humidity.repository";
import {
  NewThresholdDTO,
  hardcodedThresholds,
  newThresholdChecker,
  testForHardcodedThresholdsHumidity,
} from "../shared/dto/new-threshold-dto";

@Injectable()
export class HumidityService {
  constructor(private readonly humidityRepository: HumidityRepository) {}

  findAllInterval(interval: IntervalQuery) {
    if (!isDefined(interval)) return this.humidityRepository.findLatest();
    validate(interval);
    return this.humidityRepository.findAllInterval(interval);
  }

  getDataPointThresholds() {
    return this.humidityRepository.getDatapointThresholds();
  }

  postThresholdRequest(newThreshold: NewThresholdDTO) {
    newThresholdChecker(newThreshold);
    testForHardcodedThresholdsHumidity(newThreshold);
    return this.humidityRepository.postThresholdRequest(newThreshold);
  }

  getHardcodedThresholds() {
    return hardcodedThresholds.humidity;
  }
}
