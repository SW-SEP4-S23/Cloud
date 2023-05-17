import { DataType } from "@prisma/client";

export interface DownlinkData {
  cmd: "tx";
  EUI: string;
  port: number;
  confirmed: false;
  data: string;
}

export interface ThresholdValues {
  minValue: number;
  maxValue: number;
}

export interface DownlinkThresholds {
  [DataType.CO2]: ThresholdValues;
  [DataType.HUMIDITY]: ThresholdValues;
  [DataType.TEMPERATURE]: ThresholdValues;
}

export interface DownlinkPayload {
  ackId: number;
  thresholds: DownlinkThresholds;
}
