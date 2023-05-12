import { Injectable } from "@nestjs/common";
import { IntervalQuery, intervalQueryChecker } from "../shared/interval-query";
import { HumidityRepository } from "./humidity.repository";
import { newValsDTOChecker } from "../shared/newValsDTO";
import { NewValsDTO } from "../shared/newValsDTO";

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

  updateThresholds(newVals: NewValsDTO) {
    newValsDTOChecker(newVals);
    return this.humidityRepository.updateThresholds(newVals);
  }
}
