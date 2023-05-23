import {
  Body,
  Controller,
  Post,
  Patch,
  Get,
  Param,
  HttpException,
} from "@nestjs/common";
import { SpeciesService } from "./species.service";
import { NewSpeciesDTO } from "./dto/new-species-dto";
import { SpeciesNotFoundError } from "./exceptions/SpeciesNotFoundError";
import { SpeciesNameAlreadyExistsError } from "./exceptions/SpeciesNameAlreadyExistsError";

@Controller("stock/species")
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Post()
  async createSpecies(@Body() newSpeciesDTO: NewSpeciesDTO) {
    try {
      return await this.speciesService.createSpecies(newSpeciesDTO);
    } catch (e) {
      if (e instanceof SpeciesNameAlreadyExistsError) {
        throw new HttpException(e.message, 400);
      }
      throw new HttpException(e.message, 500);
    }
  }

  @Patch(":nameToBeChanged")
  async updateSpecies(
    @Param("nameToBeChanged") nameToBeChanged: string,
    @Body() NewSpeciesDTO: NewSpeciesDTO,
  ) {
    try {
      return await this.speciesService.updateSpecies(
        nameToBeChanged,
        NewSpeciesDTO,
      );
    } catch (e) {
      if (e instanceof SpeciesNotFoundError) {
        throw new HttpException(e.message, 404);
      }
      if (e instanceof SpeciesNameAlreadyExistsError) {
        throw new HttpException(e.message, 400);
      }
      throw new HttpException(e.message, 500);
    }
  }

  @Get()
  getAllSpecies() {
    return this.speciesService.getAllSpecies();
  }

  @Get(":name")
  async getSpecies(@Param("name") name: string) {
    try {
      return await this.speciesService.getSpeciesByName(name);
    } catch (e) {
      if (e instanceof SpeciesNotFoundError) {
        throw new HttpException(e.message, 404);
      }
      throw new HttpException(e.message, 500);
    }
  }
}
