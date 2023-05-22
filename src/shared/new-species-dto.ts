import { Optional } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class NewSpeciesDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @Optional()
  @IsNumber()
  optimalCo2?: number;

  @ApiPropertyOptional()
  @Optional()
  @IsNumber()
  optimalTemperature?: number;

  @ApiPropertyOptional()
  @Optional()
  @IsNumber()
  optimalHumidity?: number;
}
