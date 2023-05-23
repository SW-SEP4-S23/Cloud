import { ApiProperty } from "@nestjs/swagger";
import { NewSpeciesDTO } from "./new-species-dto";
import { IsString } from "class-validator";

export class UpdateSpeciesDTO {
  @ApiProperty()
  updateValues: NewSpeciesDTO;

  @ApiProperty()
  @IsString()
  nameToBeChanged: string;
}
