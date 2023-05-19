import {
  Contains,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class UplinkData {
  @Contains("rx")
  cmd: string; // identifies type of message, rx = uplink message

  @IsString()
  EUI: string; // device EUI, 16 hex digits (without dashes)

  @IsNumber()
  ts: number; // server timestamp as number (seconds from Linux epoch)

  @IsBoolean()
  ack: boolean; // acknowledgement flag as set by device

  @IsNumber()
  fcnt: number; // frame counter, a 32-bit number

  @IsNumber()
  port: number; // port as sent by the end device

  @IsOptional()
  @IsString()
  encdata?: string; // data payload (APPSKEY encrypted hex string)

  @IsOptional()
  @IsString()
  data?: string; // data payload (decrypted, plaintext hex string)
}
