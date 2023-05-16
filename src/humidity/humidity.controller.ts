import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { HumidityService } from "./humidity.service";
import { NewValsDTO } from "../shared/newValsDTO";

@Controller("environment/humidity")
export class HumidityController {
  constructor(private readonly humidityService: HumidityService) {}

  @Get()
  findAllInterval(@Query() interval: IntervalQuery) {
    return this.humidityService.findAllInterval(interval);
  }

  @Get("/thresholds")
  getDataPointThresholds() {
    return this.humidityService.getDataPointThresholds();
  }

  @Post("/thresholds")
  postThresholdRequest(@Body() newVals: NewValsDTO) {
    return this.humidityService.postThresholdRequest(newVals);
  }
}
