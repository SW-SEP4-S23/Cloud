import { Controller, Get, Query, Patch, Body } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { Co2Service } from "./co2.service";
import { NewValsDTO } from "../shared/newValsDTO";

@Controller("environment/co2")
export class Co2Controller {
  constructor(private readonly co2Service: Co2Service) {}

  @Get()
  findAllInterval(@Query() interval: IntervalQuery) {
    return this.co2Service.findAllInterval(interval);
  }

  @Patch()
  updateThresholds(@Body() newVals: NewValsDTO) {
    return this.co2Service.updateThresholds(newVals);
  }
}
