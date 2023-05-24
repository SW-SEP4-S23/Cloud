import { Type } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { HttpException, HttpStatus } from "@nestjs/common";

export class IntervalQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}

export const isDefined = (interval: IntervalQuery): boolean => {
  if (interval === undefined) return false;
  if (interval.startDate === undefined && interval.endDate === undefined)
    return false;
  return true;
};

export const validate = (interval: IntervalQuery): void => {
  if (interval.startDate === undefined || interval.endDate === undefined) {
    throw new HttpException(
      "Both startDate and endDate must be provided together.",
      HttpStatus.BAD_REQUEST,
    );
  }
  if (interval.startDate > interval.endDate) {
    throw new HttpException(
      "Start date cannot be after end date",
      HttpStatus.BAD_REQUEST,
    );
  }
};
