import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { NewThresholdDTO } from "./newThresholdDTO";

export class NewThresholdWrapperDTO {
  @ApiProperty()
  @Type(() => NewThresholdDTO)
  newTemperatureThreshold: NewThresholdDTO;

  @ApiProperty()
  @Type(() => NewThresholdDTO)
  newCo2Threshold: NewThresholdDTO;

  @ApiProperty()
  @Type(() => NewThresholdDTO)
  newHumidityThreshold: NewThresholdDTO;
}
