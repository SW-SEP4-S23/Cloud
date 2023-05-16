import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { HttpException, HttpStatus } from "@nestjs/common";

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

export const newValsDTOChecker = (newThresholds: NewThresholdDTO) => {
  if (newThresholds.minValue > newThresholds.maxValue) {
    throw new HttpException(
      "tempMin must be less than tempMax",
      HttpStatus.BAD_REQUEST,
    );
  }
};
