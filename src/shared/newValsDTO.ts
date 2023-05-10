import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class NewValsDTO {
  @ApiProperty()
  @Type(() => Number)
  tempMin: number;

  @ApiProperty()
  @Type(() => Number)
  tempMax: number;
}
