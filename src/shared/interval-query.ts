import { Type } from "class-transformer";
import { IsDate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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
