import { DataType } from "@prisma/client";
import { DownlinkPayload } from "./dto/downlink-data";

export function hexToNumberArray(hex: string, interval = 2): number[] {
  const hexArray = hex.match(new RegExp(`.{1,${interval}}`, "g"));
  return hexArray.map((hex) => parseInt(hex, 16));
}

export function uplinkHexPayloadToData(hexPayload: string) {
  const numbers = hexToNumberArray(hexPayload);
  const [temperature, co2, humidity, id] = numbers;
  return { id, temperature, co2, humidity };
}

// convert to this format: "TTTTCCCCHHHHUU"
export function downlinkDataToHexPayload(downlinkData: DownlinkPayload) {
  const {
    ackId,
    thresholds: { TEMPERATURE, CO2, HUMIDITY },
  } = downlinkData;

  return (
    numberToHex(TEMPERATURE.minValue) +
    numberToHex(TEMPERATURE.maxValue) +
    numberToHex(CO2.minValue) +
    numberToHex(CO2.maxValue) +
    numberToHex(HUMIDITY.minValue) +
    numberToHex(HUMIDITY.maxValue) +
    numberToHex(ackId, 2)
  );
}

function numberToHex(value: number, padding = 4) {
  return value.toString(16).padStart(padding, "0");
}
