export function translateHex(transformedData: string): number[] {
  // Get the first 6 hex digits (3 bytes) from the input string
  const hexSubstring = transformedData.substring(0, 6);

  // Convert the hex substring to a number
  const hexValue = parseInt(hexSubstring, 16);

  // Create an array to store the result values
  const result = new Array<number>(3);

  // Extract the bytes from the value
  for (let i = 0; i < 3; i++) {
    const byte = (hexValue >> (8 * (2 - i))) & 0xff;
    result[i] = byte;
  }

  // Return the result array
  return result;
}

// Temporary interface
export interface DownlinkPayload {
  id: string;
  temperature: {
    minValue: number;
    maxValue: number;
  };
  co2: {
    minValue: number;
    maxValue: number;
  };
  humidity: {
    minValue: number;
    maxValue: number;
  };
}

// convert to this format: "TTTTCCCCHHHHUU"
export function downlinkPayloadToHex(downlinkData: DownlinkPayload) {
  const { id, temperature, co2, humidity } = downlinkData;

  return (
    numberToHex(temperature.minValue) +
    numberToHex(temperature.maxValue) +
    numberToHex(co2.minValue) +
    numberToHex(co2.maxValue) +
    numberToHex(humidity.minValue) +
    numberToHex(humidity.maxValue) +
    id
  );
}

function numberToHex(value: number) {
  return value.toString(16).padStart(4, "0");
}
