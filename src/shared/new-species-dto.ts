import { Optional } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class NewSpeciesDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @Optional()
  optimalCo2?: number;

  @ApiPropertyOptional()
  @Optional()
  optimalTemperature?: number;

  @ApiPropertyOptional()
  @Optional()
  optimalHumidity?: number;
}
