import { Injectable } from "@nestjs/common";
import { IntervalQuery, validate, isDefined } from "../shared/interval-query";
import { EnvironmentRepository } from "./environment.repository";
import { NewThresholdWrapperDTO } from "../shared/newThresholdWrapperDTO";

@Injectable()
export class EnvironmentService {
  constructor(private readonly environmentRepository: EnvironmentRepository) {}

  async findAllInterval(interval: IntervalQuery) {
    if (!isDefined(interval))
      return await this.environmentRepository.findLatest();

    validate(interval);

    const data = await this.environmentRepository.findAllInterval(interval);
    const sortedData = {};
    //sorts the result from data base into an object with the type as key and the values as an array of objects with timestamp and value
    data.forEach((d) => {
      if (!sortedData[d.type]) {
        sortedData[d.type] = [];
      }
      sortedData[d.type].push({
        timestamp: d.timestamp,
        value: d.value,
      });
    });

    return sortedData;
  }

  postThresholdsRequests(newThresholds: NewThresholdWrapperDTO) {
    return this.environmentRepository.postThresholdRequests(newThresholds);
  }

  findAllThresholds() {
    return this.environmentRepository.findAllThresholds();
  }
}
