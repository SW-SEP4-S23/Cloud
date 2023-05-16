import { Controller, Get, Post, Query, Body } from "@nestjs/common";
import { TemperatureService } from "./temperature.service";
import { IntervalQuery } from "../shared/interval-query";
import { NewValsDTO } from "../shared/newValsDTO";
@Controller("environment/temperature")
export class TemperatureController {
  constructor(private readonly temperatureService: TemperatureService) {}

  @Get()
  findAllInterval(@Query() interval: IntervalQuery) {
    return this.temperatureService.findAllInterval(interval);
  }

  @Get("/thresholds")
  getDataPointThresholds() {
    return this.temperatureService.getDataPointThresholds();
  }

  @Post("/thresholds")
  postThresholdRequest(@Body() newVals: NewValsDTO) {
    return this.temperatureService.postThresholdRequest(newVals);
  }
}
