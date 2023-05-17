import { Injectable } from "@nestjs/common";
import { TemperatureRepository } from "./temperature.repository";
import {
  NewThresholdDTO,
  newThresholdChecker,
} from "../shared/newThresholdDTO";
import { IntervalQuery, intervalQueryChecker } from "../shared/interval-query";

@Injectable()
export class TemperatureService {
  constructor(private readonly temperatureRepository: TemperatureRepository) {}

  findAllInterval(interval: IntervalQuery) {
    intervalQueryChecker(interval);
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
