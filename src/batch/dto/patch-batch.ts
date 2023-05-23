import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate } from "class-validator";

export class PatchHarvestDate {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  harvestDate: Date;
}
