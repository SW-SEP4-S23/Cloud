import { EnvironmentService } from "./environment.service";
import { IntervalQuery } from "../shared/dto/interval-query";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { NewThresholdWrapperDTO } from "./shared/dto/new-threshold-wrapper-dto";

@Controller("environment")
export class EnvironmentController {
  constructor(private readonly environmentService: EnvironmentService) {}

  @Get()
  findAllInterval(@Query() interval?: IntervalQuery) {
    return this.environmentService.findAllInterval(interval);
  }

  @Post("/thresholds")
  postThresholdsRequests(@Body() body: NewThresholdWrapperDTO) {
    return this.environmentService.postThresholdsRequests(body);
  }

  @Get("/thresholds")
  findAllThresholds() {
    return this.environmentService.findAllThresholds();
  }

  @Get("/hardcoded-thresholds")
  getHardcodedThresholds() {
    return this.environmentService.getHardcodedThresholds();
  }
}
