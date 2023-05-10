import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

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
