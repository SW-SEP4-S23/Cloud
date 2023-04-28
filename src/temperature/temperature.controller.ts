import { Controller, Get, Query } from "@nestjs/common";
import { TemperatureService } from "./temperature.service";
import { IntervalQuery } from "../shared/interval-query";

@Controller("temperature")
export class TemperatureController {
  constructor(private readonly temperatureService: TemperatureService) {}

  @Get()
  findAllInterval(@Query() interval: IntervalQuery) {
    return this.temperatureService.findAllInterval(interval);
  }
}
