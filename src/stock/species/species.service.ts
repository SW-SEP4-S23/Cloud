import { UpdateSpeciesDTO } from "./dto/update-species-dto";
import { Injectable } from "@nestjs/common";
import { SpeciesRepository } from "./species.repository";
import { NewSpeciesDTO } from "./dto/new-species-dto";
import { SpeciesNotFoundError } from "../shared/exceptions/SpeciesNotFoundError";

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

  async getAllSpecies() {
    const data = await this.speciesRepo.getAllSpecies();

    const transformedData: Record<
      string,
      {
        optimalCo2: number;
        optimalHumidity: number;
        optimalTemperature: number;
        totalPlants: number;
      }
    > = {};
    data.forEach((item) => {
      const {
        name,
        optimalCo2,
        optimalHumidity,
        optimalTemperature,
        plantBatches,
      } = item;
      const totalPlants = plantBatches.reduce(
        (sum, batch) => sum + batch.amount,
        0,
      );

      transformedData[name] = {
        optimalCo2,
        optimalHumidity,
        optimalTemperature,
        totalPlants,
      };
    });
    return transformedData;
  }

  async getSpeciesByName(name: string) {
    const data = await this.speciesRepo.getSpeciesByName(name);

    if (!data) {
      throw new SpeciesNotFoundError(name);
    }

    const transformedData = {
      name: data.name,
      optimalCo2: data.optimalCo2,
      optimalHumidity: data.optimalHumidity,
      optimalTemperature: data.optimalTemperature,
      totalPlants: data.plantBatches.reduce(
        (sum, batch) => sum + batch.amount,
        0,
      ),
      plantBatches: data.plantBatches.reduce((result, batch) => {
        result[batch.id] = {
          amount: batch.amount,
          harvestDate: batch.harvestDate,
          plantingDate: batch.plantingDate,
        };
        return result;
      }, {} as Record<string, { amount: number; harvestDate: Date; plantingDate: Date }>),
    };

    return transformedData;
  }
}
