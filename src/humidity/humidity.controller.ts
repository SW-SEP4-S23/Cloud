import { Controller, Get, Query } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { HumidityService } from "./humidity.service";

@Controller("environment/humidity")
export class HumidityController {
  constructor(private readonly humidityService: HumidityService) {}

  @Get()
  findAllInterval(@Query() interval: IntervalQuery) {
    return this.humidityService.findAllInterval(interval);
  }
}
