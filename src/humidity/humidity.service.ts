import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { HumidityRepository } from "./humidity.repository";

@Injectable()
export class HumidityService {
  constructor(private readonly humidityRepository: HumidityRepository) {}

  findAllInterval(interval: IntervalQuery) {
    // TODO : if interval is null, return all temperatures
    //if statements to check if the interval is valid
    return this.humidityRepository.findAllInterval(interval);
  }
}
