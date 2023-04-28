import { Injectable } from "@nestjs/common";
import { TemperatureRepository } from "./temperature.repository";
import { IntervalQuery } from "../shared/interval-query";

@Injectable()
export class TemperatureService {
  constructor(private readonly temperatureRepository: TemperatureRepository) {}

  findAllInterval(interval: IntervalQuery) {
    // TODO : if interval is null, return all temperatures
    //if statements to check if the interval is valid
    return this.temperatureRepository.findAllInterval(interval);
  }
}
