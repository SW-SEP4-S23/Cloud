import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class createSpeciesLogDto {
  @IsString()
  @ApiProperty()
  message: string;
}
