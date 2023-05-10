import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { NewValsDTO } from "./newValsDTO";

export class allVariablesNewValsDTO {
  @ApiProperty()
  @Type(() => NewValsDTO)
  newTempVals: NewValsDTO;

  @ApiProperty()
  @Type(() => NewValsDTO)
  newCo2Vals: NewValsDTO;

  @ApiProperty()
  @Type(() => NewValsDTO)
  newHumidityVals: NewValsDTO;
}
