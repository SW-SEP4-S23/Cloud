import { Injectable } from "@nestjs/common";
import { IntervalQuery, intervalQueryChecker } from "../shared/interval-query";
import { EnvironmentRepository } from "./environment.repository";
import { allVariablesNewValsDTO } from "../shared/allVariablesNewValsDTO";

@Injectable()
export class EnvironmentService {
  constructor(private readonly environmentRepository: EnvironmentRepository) {}

  findAllInterval(interval: IntervalQuery) {
    intervalQueryChecker(interval);
    return this.environmentRepository.findAllInterval(interval);
  }

  postThresholdsRequests(newVals: allVariablesNewValsDTO) {
    return this.environmentRepository.postThresholdRequests(newVals);
  }

  findAllThresholds() {
    return this.environmentRepository.findAllThresholds();
  }
}
