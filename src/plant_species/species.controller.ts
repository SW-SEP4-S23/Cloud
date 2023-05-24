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
      switch (e.constructor) {
        case SpeciesNameAlreadyExistsError:
          throw new HttpException(e.message, 400);
        default:
          throw new HttpException(e.message, 500);
      }
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
      switch (e.constructor) {
        case SpeciesNotFoundError:
          throw new HttpException(e.message, 404);
        case SpeciesNameAlreadyExistsError:
          throw new HttpException(e.message, 400);
        default:
          throw new HttpException(e.message, 500);
      }
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
      switch (e.constructor) {
        case SpeciesNotFoundError:
          throw new HttpException(e.message, 404);
        default:
          throw new HttpException(e.message, 500);
      }
    }
  }
}
