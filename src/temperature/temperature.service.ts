import { Injectable } from "@nestjs/common";
import { TemperatureRepository } from "./temperature.repository";
import { IntervalQuery, intervalQueryChecker } from "../shared/interval-query";

@Injectable()
export class TemperatureService {
  constructor(private readonly temperatureRepository: TemperatureRepository) {}

  findAllInterval(interval: IntervalQuery) {
    intervalQueryChecker(interval);
    return this.temperatureRepository.findAllInterval(interval);
  }
}
