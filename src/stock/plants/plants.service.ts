import { Injectable } from "@nestjs/common";
import { PlantsRepository } from "./plants.repository";

@Injectable()
export class PlantsService {
  constructor(private readonly plantsRepository: PlantsRepository) {}

  findAll() {
    return this.plantsRepository.findAll();
  }

  findOne(id: number) {
    return this.plantsRepository.findOne(id);
  }
}
