import { Injectable } from "@nestjs/common";
import { IntervalQuery, validate, isDefined } from "../shared/interval-query";
import { HumidityRepository } from "./humidity.repository";
import { newThresholdChecker } from "../shared/new-threshold-dto";
import { NewThresholdDTO } from "../shared/new-threshold-dto";

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
    return this.humidityRepository.postThresholdRequest(newThreshold);
  }
}
