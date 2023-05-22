import { Injectable } from "@nestjs/common";

@Injectable()
export class SpeciesController {
  constructor(private readonly speciesService) {}
}
