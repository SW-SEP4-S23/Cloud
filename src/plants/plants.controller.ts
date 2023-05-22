import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from "@nestjs/common";
import { PlantsService } from "./plants.service";

@Controller("stock/plants")
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Get()
  findAll() {
    return this.plantsService.findAll();
  }

  @Get("/:id")
  async findOne(@Param("id") id: number) {
    const plantToReturn = await this.plantsService.findOne(id);

    if (!plantToReturn) {
      throw new HttpException("Plant not found", HttpStatus.NOT_FOUND);
    }

    return plantToReturn;
  }
}
