import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber } from "class-validator";
import { HttpException, HttpStatus } from "@nestjs/common";
import { NewThresholdWrapperDTO } from "./new-threshold-wrapper-dto";

export class NewThresholdDTO {
  @IsDefined()
  @IsNumber()
  @ApiProperty()
  minValue: number;

  @IsDefined()
  @IsNumber()
  @ApiProperty()
  maxValue: number;
}

export const newThresholdChecker = (newThresholds: NewThresholdDTO) => {
  if (newThresholds.minValue > newThresholds.maxValue) {
    throw new HttpException(
      "minValue must be less than maxValue",
      HttpStatus.BAD_REQUEST,
    );
  }
  if (
    (newThresholds.minValue == null && newThresholds.maxValue !== null) ||
    (newThresholds.minValue !== null && newThresholds.maxValue == null)
  ) {
    throw new HttpException(
      "minValue and maxValue must either be fully null or not null at the same time",
      HttpStatus.BAD_REQUEST,
    );
  }
};

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
    newThresholds.minValue < hardcodedThresholds.co2.min ||
    newThresholds.maxValue > hardcodedThresholds.co2.max
  ) {
    throw new HttpException(
      "Co2 thresholds must be within the range allowed by the hardware...",
      HttpStatus.BAD_REQUEST,
    );
  }
};

export const testForHardcodedThresholdsHumidity = (
  newThresholds: NewThresholdDTO,
) => {
  if (
    newThresholds.minValue < hardcodedThresholds.humidity.min ||
    newThresholds.maxValue > hardcodedThresholds.humidity.max
  ) {
    throw new HttpException(
      "Humidity thresholds must be within the range allowed by the hardware...",
      HttpStatus.BAD_REQUEST,
    );
  }
};

export const testForHardcodedThresholdsTemperature = (
  newThresholds: NewThresholdDTO,
) => {
  if (
    newThresholds.minValue < hardcodedThresholds.temperature.min ||
    newThresholds.maxValue > hardcodedThresholds.temperature.max
  ) {
    throw new HttpException(
      "Temperature thresholds must be within the range allowed by the hardware...",
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
