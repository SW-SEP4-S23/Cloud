import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { HttpException, HttpStatus } from "@nestjs/common";

export class NewValsDTO {
  @IsNumber()
  @ApiProperty()
  @Type(() => Number)
  minVal: number;

  @IsNumber()
  @ApiProperty()
  @Type(() => Number)
  maxVal: number;
}

export const newValsDTOChecker = (newVals: NewValsDTO) => {
  if (newVals.minVal > newVals.maxVal) {
    throw new HttpException(
      "tempMin must be less than tempMax",
      HttpStatus.BAD_REQUEST,
    );
  }
};

export const newValNullCheck = (newVals: NewValsDTO) => {
  return newVals.minVal == null || newVals.maxVal == null;
};
