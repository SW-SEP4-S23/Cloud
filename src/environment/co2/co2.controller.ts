import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { IntervalQuery } from "../../shared/interval-query";
import { Co2Service } from "./co2.service";
import { NewThresholdDTO } from "../../shared/new-threshold-dto";

@Controller("environment/co2")
export class Co2Controller {
  constructor(private readonly co2Service: Co2Service) {}

  @Get()
  findAllInterval(@Query() interval?: IntervalQuery) {
    return this.co2Service.findAllInterval(interval);
  }

  @Get("/thresholds")
  getDataPointThresholds() {
    return this.co2Service.getDataPointThresholds();
  }

  @Post("/thresholds")
  postThresholdRequest(@Body() newThreshold: NewThresholdDTO) {
    return this.co2Service.postThresholdRequest(newThreshold);
  }

  @Get("/hardcoded-thresholds")
  getHardcodedThresholds() {
    return this.co2Service.getHardcodedThresholds();
  }
}
