import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { EnvironmentRepository } from "./environment.repository";
import { allVariablesNewValsDTO } from "../shared/allVariablesNewValsDTO";

@Injectable()
export class EnvironmentService {
  constructor(private readonly environmentRepository: EnvironmentRepository) {}

  findAllInterval(interval: IntervalQuery) {
    return this.environmentRepository.findAllInterval(interval);
  }

  setNewValues(newVals: allVariablesNewValsDTO) {
    const updatedValues = this.environmentRepository.setNewValues(newVals);
    return "TODO: updatedvalues -> new websocket service";
  }
}
