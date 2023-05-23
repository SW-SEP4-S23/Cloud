import { Body, Controller, Post, Patch, Get, Param } from "@nestjs/common";
import { NewSpeciesDTO } from "../shared/new-species-dto";
import { SpeciesService } from "./species.service";
import { UpdateSpeciesDTO } from "../shared/update-species-dto";

@Controller("stock/species")
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Post()
  createSpecies(@Body() newSpeciesDTO: NewSpeciesDTO) {
    return this.speciesService.createSpecies(newSpeciesDTO);
  }

  @Patch(":nameToBeChanged")
  updateSpecies(
    @Param("nameToBeChanged") nameToBeChanged: string,
    @Body() NewSpeciesDTO: NewSpeciesDTO,
  ) {
    return this.speciesService.updateSpecies(nameToBeChanged, NewSpeciesDTO);
  }

  @Get()
  getAllSpecies() {
    return this.speciesService.getAllSpecies();
  }

  @Get(":name")
  getSpecies(@Param("name") name: string) {
    return this.speciesService.getSpeciesByName(name);
  }
}
