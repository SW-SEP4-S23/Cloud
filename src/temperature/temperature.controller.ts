import { Controller, Get, Patch, Query, Body } from "@nestjs/common";
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

  @Patch("/thresholds")
  updateThresholds(@Body() newVals: NewValsDTO) {
    return this.temperatureService.updateThresholds(newVals);
  }
}
