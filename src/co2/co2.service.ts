import { Injectable } from "@nestjs/common";
import { IntervalQuery, intervalQueryChecker } from "../shared/interval-query";
import { Co2Repository } from "./co2.repository";
import { NewThresholdDTO, newValsDTOChecker } from "../shared/newThresholdDTO";

@Injectable()
export class Co2Service {
  constructor(private readonly co2Repository: Co2Repository) {}

  findAllInterval(interval: IntervalQuery) {
    intervalQueryChecker(interval);
    return this.co2Repository.findAllInterval(interval);
  }

  getDataPointThresholds() {
    return this.co2Repository.getDataPointThresholds();
  }

  postThresholdRequest(newThreshold: NewThresholdDTO) {
    newValsDTOChecker(newThreshold);
    return this.co2Repository.postThresholdRequest(newThreshold);
  }
}
