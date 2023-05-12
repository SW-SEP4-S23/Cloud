import { Controller, Get, Query, Patch, Body } from "@nestjs/common";
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

  @Patch()
  updateThresholds(@Body() newVals: NewValsDTO) {
    return this.humidityService.updateThresholds(newVals);
  }
}
