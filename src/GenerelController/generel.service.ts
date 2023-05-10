import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { GenerelRepository } from "./generel.repository";
import { NewValsDTO } from "../shared/newValsDTO";

@Injectable()
export class GenerelService {
  constructor(private readonly generelRepository: GenerelRepository) {}

  findAllInterval(interval: IntervalQuery) {
    return this.generelRepository.findAllInterval(interval);
  }

  setNewValues(newVals: NewValsDTO) {
    return this.generelRepository.setNewValues(newVals);
  }
}
