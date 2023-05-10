import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { GenerelRepository } from "./generel.repository";
import { NewValsDTO } from "../shared/newValsDTO";
import { allVariablesNewValsDTO } from "../shared/allVariablesNewValsDTO";

@Injectable()
export class GenerelService {
  constructor(private readonly generelRepository: GenerelRepository) {}

  findAllInterval(interval: IntervalQuery) {
    return this.generelRepository.findAllInterval(interval);
  }

  setNewValues(newVals: allVariablesNewValsDTO) {
    const updatedValues = this.generelRepository.setNewValues(newVals);
    return "TODO: updatedvalues -> new websocket service";
  }
}
