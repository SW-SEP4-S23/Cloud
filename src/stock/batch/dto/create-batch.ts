import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDate,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  Min,
} from "class-validator";

export class CreateBatch {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  plantingDate: Date;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  species: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  amount: number;
}
