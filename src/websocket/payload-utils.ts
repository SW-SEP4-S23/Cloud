import { DownlinkPayload } from "./dto/downlink-data";
import { MAX_ACK_ID } from "./constants";

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
    numberToHex(TEMPERATURE.minValue, 2) +
    numberToHex(TEMPERATURE.maxValue, 2) +
    numberToHex(CO2.minValue, 2) +
    numberToHex(CO2.maxValue, 2) +
    numberToHex(HUMIDITY.minValue, 2) +
    numberToHex(HUMIDITY.maxValue, 2) +
    numberToHex(ackId, 2)
  );
}

export function numberToHex(value: number, padding: number) {
  return value.toString(16).padStart(padding, "0");
}

export function payloadIdFromOriginalId(n: number) {
  return ((n - 1) % MAX_ACK_ID) + 1;
}

export function originalIdFromPayloadId(n: number, tableSize: number) {
  const bias =
    Math.floor(tableSize / MAX_ACK_ID) - (tableSize % MAX_ACK_ID === 0 ? 1 : 0);
  return ((n - 1) % MAX_ACK_ID) + 1 + bias * MAX_ACK_ID;
}
