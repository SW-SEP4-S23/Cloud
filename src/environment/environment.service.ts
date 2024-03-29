import { Injectable } from "@nestjs/common";
import {
  IntervalQuery,
  validate,
  isDefined,
} from "../shared/dto/interval-query";
import { EnvironmentRepository } from "./environment.repository";
import { NewThresholdWrapperDTO } from "./shared/dto/new-threshold-wrapper-dto";
import { DataType } from "@prisma/client";
import {
  hardcodedThresholds,
  newThresholdChecker,
  testForHardcodedThresholds,
} from "./shared/dto/new-threshold-dto";

@Injectable()
export class EnvironmentService {
  constructor(private readonly environmentRepository: EnvironmentRepository) {}

  async findAllInterval(interval: IntervalQuery) {
    if (!isDefined(interval))
      return await this.environmentRepository.findLatest();

    validate(interval);

    const data = await this.environmentRepository.findAllInterval(interval);

    // Transforms the result from database into an object with the
    // datatype as key and the values as an array of objects with timestamp and value
    const sortedData = data.reduce((acc, curr) => {
      if (!acc[curr.type]) {
        acc[curr.type] = [];
      }
      acc[curr.type].push({
        timestamp: curr.timestamp,
        value: curr.value,
      });
      return acc;
    }, {} as Record<DataType, { timestamp: Date; value: number }[]>);

    return sortedData;
  }

  postThresholdsRequests(newThresholds: NewThresholdWrapperDTO) {
    testForHardcodedThresholds(newThresholds);
    for (const key in newThresholds) {
      if (newThresholds.hasOwnProperty(key)) {
        const thresholdDTO = newThresholds[key];
        newThresholdChecker(thresholdDTO);
      }
    }
    return this.environmentRepository.postThresholdRequests(newThresholds);
  }

  findAllThresholds() {
    return this.environmentRepository.findAllThresholds();
  }

  getHardcodedThresholds() {
    return hardcodedThresholds;
  }
}
