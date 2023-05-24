import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { PlantsService } from "./plants.service";
import { PlantNotFoundError } from "../logs/exceptions/PlantNotFoundError";

@Controller("stock/plants")
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Get()
  findAll() {
    return this.plantsService.findAll();
  }

  @Get("/:id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    try {
      return await this.plantsService.findOne(id);
    } catch (e) {
      if (e instanceof PlantNotFoundError) {
        throw new HttpException(e.message, 404);
      }

      throw new HttpException(e.message, 500);
    }
  }
}
