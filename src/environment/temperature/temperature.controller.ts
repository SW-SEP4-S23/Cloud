import { Controller, Get, Post, Query, Body } from "@nestjs/common";
import { TemperatureService } from "./temperature.service";
import { IntervalQuery } from "../../shared/interval-query";
import { NewThresholdDTO } from "../../shared/new-threshold-dto";

@Controller("environment/temperature")
export class TemperatureController {
  constructor(private readonly temperatureService: TemperatureService) {}

  @Get()
  findAllInterval(@Query() interval?: IntervalQuery) {
    return this.temperatureService.findAllInterval(interval);
  }

  @Get("/thresholds")
  getDataPointThresholds() {
    return this.temperatureService.getDataPointThresholds();
  }

  @Post("/thresholds")
  postThresholdRequest(@Body() newThreshold: NewThresholdDTO) {
    return this.temperatureService.postThresholdRequest(newThreshold);
  }

  @Get("/hardcoded-thresholds")
  getHardcodedThresholds() {
    return this.temperatureService.getHardcodedThresholds();
  }
}
