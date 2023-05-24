import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { IntervalQuery } from "../../shared/dto/interval-query";
import { HumidityService } from "./humidity.service";
import { NewThresholdDTO } from "../shared/dto/new-threshold-dto";

@Controller("environment/humidity")
export class HumidityController {
  constructor(private readonly humidityService: HumidityService) {}

  @Get()
  findAllInterval(@Query() interval?: IntervalQuery) {
    return this.humidityService.findAllInterval(interval);
  }

  @Get("/thresholds")
  getDataPointThresholds() {
    return this.humidityService.getDataPointThresholds();
  }

  @Post("/thresholds")
  postThresholdRequest(@Body() newThreshold: NewThresholdDTO) {
    return this.humidityService.postThresholdRequest(newThreshold);
  }

  @Get("/hardcoded-thresholds")
  getHardcodedThresholds() {
    return this.humidityService.getHardcodedThresholds();
  }
}
