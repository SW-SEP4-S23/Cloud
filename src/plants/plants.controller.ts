import { Controller, Get, Param } from "@nestjs/common";
import { PlantsService } from "./plants.service";

@Controller("stock/plants")
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Get()
  findAll() {
    return this.plantsService.findAll();
  }

  @Get("/:id")
  findOne(@Param("id") id: number) {
    return this.plantsService.findOne(id);
  }
}
