import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { HttpException, HttpStatus } from "@nestjs/common";

export class NewValsDTO {
  @IsNumber()
  @ApiProperty()
  @Type(() => Number)
  tempMin: number;

  @IsNumber()
  @ApiProperty()
  @Type(() => Number)
  tempMax: number;
}

export const newValsDTOChecker = (newVals: NewValsDTO) => {
  if (newVals.tempMin > newVals.tempMax) {
    throw new HttpException(
      "tempMin must be less than tempMax",
      HttpStatus.BAD_REQUEST,
    );
  }
};
