import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateSpeciesLogDto {
  @IsString()
  @ApiProperty()
  message: string;
}
