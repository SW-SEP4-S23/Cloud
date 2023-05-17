import { Injectable } from "@nestjs/common";
import { IntervalQuery, validate, isDefined } from "../shared/interval-query";
import { HumidityRepository } from "./humidity.repository";
import { newValsDTOChecker } from "../shared/newValsDTO";
import { NewValsDTO } from "../shared/newValsDTO";

@Injectable()
export class HumidityService {
  constructor(private readonly humidityRepository: HumidityRepository) {}

  findAllInterval(interval: IntervalQuery) {
    if (!isDefined(interval)) return this.humidityRepository.findLatest();
    validate(interval);
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
