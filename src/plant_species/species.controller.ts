import { Body, Controller, Post, Patch } from "@nestjs/common";
import { NewSpeciesDTO } from "../shared/new-species-dto";
import { SpeciesService } from "./species.service";

@Controller("stock/species")
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Post()
  createSpecies(@Body() newSpeciesDTO: NewSpeciesDTO) {
    return this.speciesService.createSpecies(newSpeciesDTO);
  }

  @Patch()
  updateSpecies(@Body() newSpeciesDTO: NewSpeciesDTO) {
    return this.speciesService.updateSpecies(newSpeciesDTO);
  }
}
