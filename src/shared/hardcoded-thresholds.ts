import { HttpException, HttpStatus } from "@nestjs/common";
import { NewThresholdWrapperDTO } from "./new-threshold-wrapper-dto";
import { NewThresholdDTO } from "./new-threshold-dto";

export const hardcodedThresholds = {
  humidity: {
    min: 0,
    max: 100,
  },
  temperature: {
    min: -40,
    max: 125,
  },
  co2: {
    min: 0,
    max: 0.5,
  },
};

export const testForHardcodedThresholdsCo2 = (
  newThresholds: NewThresholdDTO,
) => {
  if (
    newThresholds.minValue > hardcodedThresholds.co2.min &&
    newThresholds.maxValue < hardcodedThresholds.co2.max
  ) {
    throw new HttpException(
      "Thresholds must be within the range allowed by the hardware...",
      HttpStatus.BAD_REQUEST,
    );
  }
};

export const testForHardcodedThresholdsHumidity = (
  newThresholds: NewThresholdDTO,
) => {
  if (
    newThresholds.minValue > hardcodedThresholds.humidity.min &&
    newThresholds.maxValue < hardcodedThresholds.humidity.max
  ) {
    throw new HttpException(
      "Thresholds must be within the range allowed by the hardware...",
      HttpStatus.BAD_REQUEST,
    );
  }
};

export const testForHardcodedThresholdsTemperature = (
  newThresholds: NewThresholdDTO,
) => {
  if (
    newThresholds.minValue > hardcodedThresholds.temperature.min &&
    newThresholds.maxValue < hardcodedThresholds.temperature.max
  ) {
    throw new HttpException(
      "Thresholds must be within the range allowed by the hardware...",
      HttpStatus.BAD_REQUEST,
    );
  }
};

//Pretty much tailored to the current implementation of the DTO "new threshold wrapper DTO" used by the environment domain
export const testForHardcodedThresholds = (
  newThresholds: NewThresholdWrapperDTO,
) => {
  testForHardcodedThresholdsCo2(newThresholds.newCo2Threshold);
  testForHardcodedThresholdsHumidity(newThresholds.newHumidityThreshold);
  testForHardcodedThresholdsTemperature(newThresholds.newTemperatureThreshold);
};
