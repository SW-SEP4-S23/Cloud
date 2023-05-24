import { UpdateSpeciesDTO } from "./dto/update-species-dto";
import { Injectable } from "@nestjs/common";
import { SpeciesRepository } from "./species.repository";
import { NewSpeciesDTO } from "./dto/new-species-dto";
import { SpeciesNotFoundError } from "./exceptions/SpeciesNotFoundError";

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
        OptimalCo2: number;
        optimalHumidity: number;
        optimalTemperature: number;
        totalPlants: number;
      }
    > = {};
    data.forEach((item) => {
      const {
        name,
        OptimalCo2,
        optimalHumidity,
        optimalTemperature,
        PlantBatch,
      } = item;
      const totalPlants = PlantBatch.reduce(
        (sum, batch) => sum + batch.amount,
        0,
      );

      transformedData[name] = {
        OptimalCo2,
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
      OptimalCo2: data.OptimalCo2,
      optimalHumidity: data.optimalHumidity,
      optimalTemperature: data.optimalTemperature,
      totalPlants: data.PlantBatch.reduce(
        (sum, batch) => sum + batch.amount,
        0,
      ),
      PlantBatches: data.PlantBatch.reduce((result, batch) => {
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
