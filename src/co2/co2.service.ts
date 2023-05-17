import { Injectable } from "@nestjs/common";
import { IntervalQuery, validate, isDefined } from "../shared/interval-query";
import { Co2Repository } from "./co2.repository";
import {
  NewThresholdDTO,
  newThresholdChecker,
} from "../shared/newThresholdDTO";

@Injectable()
export class Co2Service {
  constructor(private readonly co2Repository: Co2Repository) {}

  findAllInterval(interval: IntervalQuery) {
    if (!isDefined(interval)) return this.co2Repository.findLatest();
    validate(interval);
    return this.co2Repository.findAllInterval(interval);
  }

  getDataPointThresholds() {
    return this.co2Repository.getDataPointThresholds();
  }

  postThresholdRequest(newThreshold: NewThresholdDTO) {
    newThresholdChecker(newThreshold);
    return this.co2Repository.postThresholdRequest(newThreshold);
  }
}
