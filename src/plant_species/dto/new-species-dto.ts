import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class NewSpeciesDTO {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  optimalCo2?: number;

  @ApiPropertyOptional()
  @IsOptional()
  optimalTemperature?: number;

  @ApiPropertyOptional()
  @IsOptional()
  optimalHumidity?: number;
}
