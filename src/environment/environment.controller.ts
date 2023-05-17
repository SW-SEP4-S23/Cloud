import { EnvironmentService } from "./environment.service";
import { IntervalQuery } from "../shared/interval-query";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { NewThresholdWrapperDTO } from "../shared/newThresholdWrapperDTO";

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

  @Get("/treshholds")
  findAllThresholds() {
    return this.environmentService.findAllThresholds();
  }
}
