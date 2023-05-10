import { GenerelService } from "./generel.service";
import { IntervalQuery } from "./../shared/interval-query";
import { Body, Controller, Get, Put, Query } from "@nestjs/common";
import { allVariablesNewValsDTO } from "../shared/allVariablesNewValsDTO";

@Controller("environment")
export class GenerelController {
  constructor(private readonly generelService: GenerelService) {}

  @Get()
  findAllInterval(@Query() interval: IntervalQuery) {
    return this.generelService.findAllInterval(interval);
  }

  @Put()
  putAllNewValues(@Body() body: allVariablesNewValsDTO) {
    return this.generelService.setNewValues(body);
  }
}
