import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { HttpException, HttpStatus } from "@nestjs/common";

export class IsHarvested {
  @ApiPropertyOptional()
  @IsOptional()
  isHarvested: string;
}

//scuff fix for class-validator/transformer not working
export const testString = (value) => {
  const validValues = ["true", "false", undefined];
  if (!validValues.includes(value))
    throw new HttpException(
      `isHarvested must be one of ${validValues}`,
      HttpStatus.BAD_REQUEST,
    );
};
