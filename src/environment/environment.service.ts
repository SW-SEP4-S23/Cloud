import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { EnvironmentRepository } from "./environment.repository";
import { NewValsDTO } from "../shared/newValsDTO";

@Injectable()
export class EnvironmentService {
  constructor(private readonly environmentRepository: EnvironmentRepository) {}

  findAllInterval(interval: IntervalQuery) {
    return this.environmentRepository.findAllInterval(interval);
  }

  setNewValues(newVals: NewValsDTO) {
    return this.environmentRepository.setNewValues(newVals);
  }
}
