import { Injectable } from "@nestjs/common";
import { IntervalQuery, intervalQueryChecker } from "../shared/interval-query";
import { HumidityRepository } from "./humidity.repository";

@Injectable()
export class HumidityService {
  constructor(private readonly humidityRepository: HumidityRepository) {}

  findAllInterval(interval: IntervalQuery) {
    intervalQueryChecker(interval);
    return this.humidityRepository.findAllInterval(interval);
  }
}
