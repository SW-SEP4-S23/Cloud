import { ApiProperty } from "@nestjs/swagger";
import { NewSpeciesDTO } from "./new-species-dto";
import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateSpeciesDTO {
  @ApiProperty()
  updateValues: NewSpeciesDTO;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  nameToBeChanged: string;
}
