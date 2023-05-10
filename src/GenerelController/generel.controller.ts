import { GenerelService } from "./generel.service";
import { IntervalQuery } from "./../shared/interval-query";
import { Controller, Get, Query } from "@nestjs/common";
import { interval } from "rxjs";

@Controller("environment")
export class GenerelController {
  constructor(private readonly GenerelService: GenerelService) {}

  @Get()
  findAllInterval(@Query() interval: IntervalQuery) {
    return "data";
  }
}
