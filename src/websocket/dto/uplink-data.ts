import {
  Contains,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class UplinkData {
  @Contains("rx")
  cmd: string;

  @IsString()
  EUI: string;

  @IsNumber()
  ts: number;

  @IsBoolean()
  ack: boolean;

  @IsNumber()
  fcnt: number;

  @IsNumber()
  port: number;

  @IsOptional()
  @IsString()
  encdata?: string;

  @IsOptional()
  @IsString()
  data?: string;
}
