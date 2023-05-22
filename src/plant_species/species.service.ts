import { Injectable } from "@nestjs/common";
import { SpeciesRepository } from "./species.repository";
import { NewSpeciesDTO } from "../shared/new-species-dto";
import { UpdateSpeciesDTO } from "../shared/update-species-dto";

@Injectable()
export class SpeciesService {
  constructor(private readonly speciesRepo: SpeciesRepository) {}

  createSpecies(newSpeciesDTO: NewSpeciesDTO) {
    return this.speciesRepo.createSpecies(newSpeciesDTO);
  }

  updateSpecies(updateSpeciesDTO: UpdateSpeciesDTO) {
    return this.speciesRepo.updateSpecies(updateSpeciesDTO);
  }

  getAllSpecies() {
    return this.speciesRepo.getAllSpecies();
  }

  getSpeciesByName(name: string) {
    return this.speciesRepo.getSpeciesByName(name);
  }
}
