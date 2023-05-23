import { UpdateSpeciesDTO } from "./../shared/update-species-dto";
import { Injectable } from "@nestjs/common";
import { SpeciesRepository } from "./species.repository";
import { NewSpeciesDTO } from "../shared/new-species-dto";

@Injectable()
export class SpeciesService {
  constructor(private readonly speciesRepo: SpeciesRepository) {}

  createSpecies(newSpeciesDTO: NewSpeciesDTO) {
    return this.speciesRepo.createSpecies(newSpeciesDTO);
  }

  updateSpecies(nameToBeChanged: string, updateSpeciesDTO: NewSpeciesDTO) {
    const updateSpecies: UpdateSpeciesDTO = {
      nameToBeChanged: nameToBeChanged,
      updateValues: updateSpeciesDTO,
    };
    return this.speciesRepo.updateSpecies(updateSpecies);
  }

  getAllSpecies() {
    return this.speciesRepo.getAllSpecies();
  }

  getSpeciesByName(name: string) {
    return this.speciesRepo.getSpeciesByName(name);
  }
}
