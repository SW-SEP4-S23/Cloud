import { NewSpeciesDTO } from "./../shared/new-species-dto";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class SpeciesRepository {
  constructor(private readonly prisma: PrismaService) {}
  createSpecies(newSpeciesDTO: NewSpeciesDTO) {
    throw new Error("Method not implemented.");
  }
}
