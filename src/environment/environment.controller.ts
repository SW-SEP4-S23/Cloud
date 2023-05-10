import { EnvironmentService } from "./environment.service";
import { IntervalQuery } from "../shared/interval-query";
import { Body, Controller, Get, Put, Query } from "@nestjs/common";
import { NewValsDTO } from "../shared/newValsDTO";

@Controller("environment")
export class EnvironmentController {
  constructor(private readonly environmentService: EnvironmentService) {}

  @Get()
  findAllInterval(@Query() interval: IntervalQuery) {
    return this.environmentService.findAllInterval(interval);
  }

  @Put()
  putAllNewValues(@Body() body: NewValsDTO) {
    return this.environmentService.setNewValues(body);
  }
}
