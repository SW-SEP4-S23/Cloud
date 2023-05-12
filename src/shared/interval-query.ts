import { Type } from "class-transformer";
import { IsDate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { HttpException, HttpStatus } from "@nestjs/common";

export class IntervalQuery {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}

export const intervalQueryChecker = (interval: IntervalQuery) => {
  if (interval.startDate > interval.endDate) {
    throw new HttpException(
      "Start date cannot be after end date",
      HttpStatus.BAD_REQUEST,
    );
  }
};
