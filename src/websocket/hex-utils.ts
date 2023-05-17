import { DataType } from "@prisma/client";

export function hexToNumberArray(hex: string, interval = 2): number[] {
  const hexArray = hex.match(new RegExp(`.{1,${interval}}`, "g"));
  return hexArray.map((hex) => parseInt(hex, 16));
}

type ThresholdValues = {
  minVal: number;
  maxVal: number;
};

export interface DownlinkPayload {
  id: number;
  thresholds: {
    [DataType.TEMPERATURE]: ThresholdValues;
    [DataType.CO2]: ThresholdValues;
    [DataType.HUMIDITY]: ThresholdValues;
  };
}

export function uplinkHexPayloadToData(hexPayload: string) {
  const numbers = hexToNumberArray(hexPayload);
  const [temperature, co2, humidity, id] = numbers;
  return { id, temperature, co2, humidity };
}

// convert to this format: "TTTTCCCCHHHHUU"
export function downlinkDataToHexPayload(downlinkData: DownlinkPayload) {
  const {
    id,
    thresholds: { TEMPERATURE, CO2, HUMIDITY },
  } = downlinkData;

  return (
    numberToHex(TEMPERATURE.minVal) +
    numberToHex(TEMPERATURE.maxVal) +
    numberToHex(CO2.minVal) +
    numberToHex(CO2.maxVal) +
    numberToHex(HUMIDITY.minVal) +
    numberToHex(HUMIDITY.maxVal) +
    numberToHex(id, 2)
  );
}

function numberToHex(value: number, padding = 4) {
  return value.toString(16).padStart(padding, "0");
}
