import { Injectable } from "@nestjs/common";
import { SpeciesRepository } from "./species.repository";
import { NewSpeciesDTO } from "../shared/new-species-dto";
import { get } from "http";

@Injectable()
export class SpeciesService {
  constructor(private readonly speciesRepo: SpeciesRepository) {}

  createSpecies(newSpeciesDTO: NewSpeciesDTO) {
    return this.speciesRepo.createSpecies(newSpeciesDTO);
  }

  updateSpecies(newSpeciesDTO: NewSpeciesDTO) {
    return this.speciesRepo.updateSpecies(newSpeciesDTO);
  }

  getAllSpecies() {
    return this.speciesRepo.getAllSpecies();
  }

  getSpeciesByName(name: string) {
    return this.speciesRepo.getSpeciesByName(name);
  }
}
