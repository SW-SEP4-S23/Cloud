import { EnvironmentService } from "./environment.service";
import { IntervalQuery } from "../shared/interval-query";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { allVariablesNewValsDTO } from "../shared/allVariablesNewValsDTO";

@Controller("environment")
export class EnvironmentController {
  constructor(private readonly environmentService: EnvironmentService) {}

  @Get()
  findAllInterval(@Query() interval: IntervalQuery) {
    return this.environmentService.findAllInterval(interval);
  }

  @Post("/thresholds")
  postThresholdsRequests(@Body() body: allVariablesNewValsDTO) {
    return this.environmentService.postThresholdsRequests(body);
  }

  @Get("/treshholds")
  findAllThresholds() {
    return this.environmentService.findAllThresholds();
  }
}
