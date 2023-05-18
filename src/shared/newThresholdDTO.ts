import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { HttpException, HttpStatus } from "@nestjs/common";

//milo kan ikke lide navnet :()
export class NewThresholdDTO {
  @IsNumber()
  @ApiProperty()
  @Type(() => Number)
  minValue: number;

  @IsNumber()
  @ApiProperty()
  @Type(() => Number)
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
