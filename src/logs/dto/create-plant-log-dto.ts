import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePlantLogDto {
  @IsString()
  @ApiProperty()
  message: string;
}
