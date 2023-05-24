import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { PlantsService } from "./plants.service";
import { PlantNotFoundError } from "../shared/exceptions/PlantNotFoundError";

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
      switch (e.constructor) {
        case PlantNotFoundError:
          throw new HttpException(e.message, HttpStatus.NOT_FOUND);
        default:
          throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
