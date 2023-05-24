import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class NewSpeciesDTO {
  @ApiProperty()
  @IsString()
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
