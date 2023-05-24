import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { UpdateSpeciesDTO } from "./dto/update-species-dto";
import { NewSpeciesDTO } from "./dto/new-species-dto";
import { SpeciesNotFoundError } from "../shared/exceptions/SpeciesNotFoundError";
import { SpeciesNameAlreadyExistsError } from "./exceptions/SpeciesNameAlreadyExistsError";

@Injectable()
export class SpeciesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSpecies(newSpeciesDTO: NewSpeciesDTO) {
    try {
      return await this.prisma.plantSpecies.create({
        data: {
          name: newSpeciesDTO.name,
          optimalCo2: newSpeciesDTO.optimalCo2,
          optimalTemperature: newSpeciesDTO.optimalTemperature,
          optimalHumidity: newSpeciesDTO.optimalHumidity,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case "P2002":
            throw new SpeciesNameAlreadyExistsError(newSpeciesDTO.name);
          default:
            throw e;
        }
      }
    }
  }

  async updateSpecies(updateSpeciesDTO: UpdateSpeciesDTO) {
    try {
      return await this.prisma.plantSpecies.update({
        where: { name: updateSpeciesDTO.nameToBeChanged },
        data: {
          name: updateSpeciesDTO.updateValues.name,
          optimalCo2: updateSpeciesDTO.updateValues.optimalCo2,
          optimalTemperature: updateSpeciesDTO.updateValues.optimalTemperature,
          optimalHumidity: updateSpeciesDTO.updateValues.optimalHumidity,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case "P2025":
            throw new SpeciesNotFoundError(updateSpeciesDTO.nameToBeChanged);
          case "P2002":
            throw new SpeciesNameAlreadyExistsError(
              updateSpeciesDTO.updateValues.name,
            );
          default:
            throw e;
        }
      }
    }
  }

  getAllSpecies() {
    return this.prisma.plantSpecies.findMany({
      include: {
        plantBatches: {
          select: {
            amount: true,
          },
        },
      },
    });
  }

  getSpeciesByName(name: string) {
    return this.prisma.plantSpecies.findUnique({
      where: { name },
      include: {
        plantBatches: {
          select: {
            id: true,
            amount: true,
            harvestDate: true,
            plantingDate: true,
          },
        },
      },
    });
  }
}
