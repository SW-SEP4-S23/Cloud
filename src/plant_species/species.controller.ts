import { Body, Controller, Post } from "@nestjs/common";
import { NewSpeciesDTO } from "../shared/new-species-dto";

@Controller("stock/species")
export class SpeciesController {
  constructor(private readonly speciesService) {}

  @Post()
  createSpecies(@Body() newSpeciesDTO: NewSpeciesDTO) {
    return this.speciesService.createSpecies(newSpeciesDTO);
  }
}
