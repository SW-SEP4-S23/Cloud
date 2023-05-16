import { Injectable } from "@nestjs/common";
import { IntervalQuery, intervalQueryChecker } from "../shared/interval-query";
import { HumidityRepository } from "./humidity.repository";
import { newValsDTOChecker } from "../shared/newThresholdDTO";
import { NewThresholdDTO } from "../shared/newThresholdDTO";

@Injectable()
export class HumidityService {
  constructor(private readonly humidityRepository: HumidityRepository) {}

  findAllInterval(interval: IntervalQuery) {
    intervalQueryChecker(interval);
    return this.humidityRepository.findAllInterval(interval);
  }

  getDataPointThresholds() {
    return this.humidityRepository.getDataPointThresholds();
  }

  postThresholdRequest(newThreshold: NewThresholdDTO) {
    newValsDTOChecker(newThreshold);
    return this.humidityRepository.postThresholdRequest(newThreshold);
  }
}
