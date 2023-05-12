import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { Co2Repository } from "./co2.repository";
import { newValsDTOChecker } from "../shared/newValsDTO";

@Injectable()
export class Co2Service {
  constructor(private readonly co2Repository: Co2Repository) {}

  findAllInterval(interval: IntervalQuery) {
    // TODO : if interval is null, return all temperatures
    // if statements to check if the interval is valid
    return this.co2Repository.findAllInterval(interval);
  }

  getDataPointThresholds() {
    return this.co2Repository.getDataPointThresholds();
  }

  updateThresholds(newVals) {
    newValsDTOChecker(newVals);
    return this.co2Repository.updateThresholds(newVals);
  }
}
