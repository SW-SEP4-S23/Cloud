import { ApiProperty } from "@nestjs/swagger";
import { NewThresholdDTO } from "./newThresholdDTO";
import { IsOptional } from "class-validator";

export class NewThresholdWrapperDTO {
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  newTemperatureThreshold?: NewThresholdDTO;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  newCo2Threshold?: NewThresholdDTO;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  newHumidityThreshold?: NewThresholdDTO;
}
