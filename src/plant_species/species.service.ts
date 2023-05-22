import { Injectable } from "@nestjs/common";
import { SpeciesRepository } from "./species.repository";

@Injectable()
export class SpeciesService {
  constructor(private readonly speciesRepo: SpeciesRepository) {}
}
