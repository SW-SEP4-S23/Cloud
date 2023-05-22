import { NewSpeciesDTO } from "./../shared/new-species-dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class SpeciesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSpecies(newSpeciesDTO: NewSpeciesDTO) {
    try {
      return await this.prisma.plantSpecies.create({
        data: {
          name: newSpeciesDTO.name,
          OptimalCo2: newSpeciesDTO.optimalCo2
            ? newSpeciesDTO.optimalCo2
            : null,
          optimalTemperature: newSpeciesDTO.optimalTemperature
            ? newSpeciesDTO.optimalTemperature
            : null,
          optimalHumidity: newSpeciesDTO.optimalHumidity
            ? newSpeciesDTO.optimalHumidity
            : null,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === "P2002") {
          throw new HttpException(
            "Species with this name already exists",
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw e;
    }
  }

  async updateSpecies(newSpeciesDTO: NewSpeciesDTO) {
    try {
      const data = {};

      if (newSpeciesDTO.optimalCo2 !== null) {
        data["OptimalCo2"] = newSpeciesDTO.optimalCo2;
      }
      if (newSpeciesDTO.optimalTemperature !== null) {
        data["optimalTemperature"] = newSpeciesDTO.optimalTemperature;
      }
      if (newSpeciesDTO.optimalHumidity !== null) {
        data["optimalHumidity"] = newSpeciesDTO.optimalHumidity;
      }

      return await this.prisma.plantSpecies.update({
        where: { name: newSpeciesDTO.name },
        data,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === "P2025") {
          throw new HttpException(
            "Species with this name does not exist",
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw e;
    }
  }

  async getAllSpecies() {
    const data = await this.prisma.plantSpecies.findMany({
      include: {
        PlantBatch: {
          select: {
            amount: true,
          },
        },
      },
    });
    const transformedData = {};
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
    const data = await this.prisma.plantSpecies.findUnique({
      where: { name },
      include: {
        PlantBatch: {
          select: {
            id: true,
            amount: true,
            harvestDate: true,
            plantingDate: true,
          },
        },
      },
    });
    if (!data) {
      // Handle species not found
      return null;
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
        result[`batchId-${batch.id}`] = {
          amount: batch.amount,
          harvestDate: batch.harvestDate,
          plantingDate: batch.plantingDate,
        };
        return result;
      }, {}),
    };

    return transformedData;
  }
}
