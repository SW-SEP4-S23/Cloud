import { MAX_ACK_ID } from "./constants";
import {
  payloadIdFromOriginalId,
  hexToNumberArray,
  originalIdFromPayloadId,
  uplinkHexPayloadToData,
  downlinkDataToHexPayload,
} from "./payload-utils";

describe("hex to number array", () => {
  it("should return an array of 3 numbers", () => {
    expect(hexToNumberArray("000000")).toHaveLength(3);
  });

  test.each([
    { hex: "000000", expected: { temperature: 0, co2: 0, humidity: 0 } },
    { hex: "fefefe", expected: { temperature: 254, co2: 254, humidity: 254 } },
    { hex: "fe0000", expected: { temperature: 254, co2: 0, humidity: 0 } },
    { hex: "00fe00", expected: { temperature: 0, co2: 254, humidity: 0 } },
    { hex: "0000fe", expected: { temperature: 0, co2: 0, humidity: 254 } },
  ])("hexToNumberArray($hex) should return $expected", ({ hex, expected }) => {
    expect(hexToNumberArray(hex)).toEqual([
      expected.temperature,
      expected.co2,
      expected.humidity,
    ]);
  });
});

describe("uplink hex payload to data", () => {
  test.each([
    {
      hex: "00000000",
      expected: { temperature: 0, co2: 0, humidity: 0, id: 0 },
    },
    {
      hex: "fffffffe",
      expected: { temperature: 255, co2: 255, humidity: 255, id: 254 },
    },
    {
      hex: "000000fe",
      expected: { temperature: 0, co2: 0, humidity: 0, id: 254 },
    },
    {
      hex: "ff000000",
      expected: { temperature: 255, co2: 0, humidity: 0, id: 0 },
    },
    {
      hex: "00ff0000",
      expected: { temperature: 0, co2: 255, humidity: 0, id: 0 },
    },
    {
      hex: "0000ff00",
      expected: { temperature: 0, co2: 0, humidity: 255, id: 0 },
    },
    {
      hex: "000000fe",
      expected: { temperature: 0, co2: 0, humidity: 0, id: 254 },
    },
  ])(
    `uplinkHexPayloadToData($hex) should return $expected`,
    ({ hex, expected }) => {
      expect(uplinkHexPayloadToData(hex)).toEqual(expected);
    },
  );
});

describe("downlink data to hex payload", () => {
  it("should return the correct values", () => {
    expect(
      downlinkDataToHexPayload({
        ackId: 0,
        thresholds: {
          TEMPERATURE: {
            minValue: 0,
            maxValue: 0,
          },
          CO2: {
            minValue: 0,
            maxValue: 0,
          },
          HUMIDITY: {
            minValue: 0,
            maxValue: 0,
          },
        },
      }),
    ).toEqual("00000000000000");

    expect(
      downlinkDataToHexPayload({
        ackId: 254,
        thresholds: {
          TEMPERATURE: {
            minValue: 255,
            maxValue: 255,
          },
          CO2: {
            minValue: 255,
            maxValue: 255,
          },
          HUMIDITY: {
            minValue: 255,
            maxValue: 255,
          },
        },
      }),
    ).toEqual("fffffffffffffe");
  });
});

describe("converting between payload and original id", () => {
  test.each([
    { payloadId: 1, expected: 1 },
    { payloadId: MAX_ACK_ID, expected: MAX_ACK_ID },
    { payloadId: MAX_ACK_ID + 1, expected: 1 },
    { payloadId: MAX_ACK_ID * 2, expected: MAX_ACK_ID },
    { payloadId: MAX_ACK_ID * 2 + 1, expected: 1 },
  ])(
    "payloadIdFromOriginalId($payloadId) should return $expected",
    ({ payloadId, expected }) => {
      expect(payloadIdFromOriginalId(payloadId)).toEqual(expected);
    },
  );

  test.each([
    { payloadId: 1, tableSize: 1, expected: 1 },
    { payloadId: MAX_ACK_ID, tableSize: MAX_ACK_ID, expected: MAX_ACK_ID },
    { payloadId: 1, tableSize: MAX_ACK_ID + 1, expected: MAX_ACK_ID + 1 },
    {
      payloadId: MAX_ACK_ID,
      tableSize: MAX_ACK_ID * 2,
      expected: MAX_ACK_ID * 2,
    },
    {
      payloadId: 1,
      tableSize: MAX_ACK_ID * 2 + 1,
      expected: MAX_ACK_ID * 2 + 1,
    },
  ])(
    "originalIdFromPayloadId($payloadId, $tableSize) should return $expected",
    ({ payloadId, tableSize, expected }) => {
      expect(originalIdFromPayloadId(payloadId, tableSize)).toEqual(expected);
    },
  );
});
