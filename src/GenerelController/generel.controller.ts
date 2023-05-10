import { GenerelService } from "./generel.service";
import { IntervalQuery } from "./../shared/interval-query";
import { Controller, Get, Query } from "@nestjs/common";

@Controller("environment")
export class GenerelController {
  constructor(private readonly generelService: GenerelService) {}

  @Get()
  findAllInterval(@Query() interval: IntervalQuery) {
    return this.generelService.findAllInterval(interval);
  }
}
