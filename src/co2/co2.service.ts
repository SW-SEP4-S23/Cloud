import { Injectable } from "@nestjs/common";
import { IntervalQuery, validate, isDefined } from "../shared/interval-query";
import { Co2Repository } from "./co2.repository";
import {
  NewThresholdDTO,
  newThresholdChecker,
  testForHardcodedThresholdsCo2,
  hardcodedThresholds,
} from "../shared/new-threshold-dto";

@Injectable()
export class Co2Service {
  constructor(private readonly co2Repository: Co2Repository) {}

  findAllInterval(interval: IntervalQuery) {
    if (!isDefined(interval)) return this.co2Repository.findLatest();
    validate(interval);
    return this.co2Repository.findAllInterval(interval);
  }

  getDataPointThresholds() {
    return this.co2Repository.getDatapointThresholds();
  }

  postThresholdRequest(newThreshold: NewThresholdDTO) {
    newThresholdChecker(newThreshold);
    testForHardcodedThresholdsCo2(newThreshold);
    return this.co2Repository.postThresholdRequest(newThreshold);
  }

  getHardcodedThresholds() {
    return hardcodedThresholds.co2;
  }
}
