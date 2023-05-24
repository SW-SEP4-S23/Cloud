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
    ["000000", [0, 0, 0]],
    ["ffffff", [255, 255, 255]],
    ["ff0000", [255, 0, 0]],
    ["00ff00", [0, 255, 0]],
    ["0000ff", [0, 0, 255]],
  ])("should return the correct values", (hex, expected) => {
    expect(hexToNumberArray(hex)).toEqual(expected);
  });
});

describe("uplink hex payload to data", () => {
  it("should return the correct values", () => {
    expect(uplinkHexPayloadToData("00000000")).toEqual({
      temperature: 0,
      co2: 0,
      humidity: 0,
      id: 0,
    });
    expect(uplinkHexPayloadToData("ffffffff")).toEqual({
      temperature: 255,
      co2: 255,
      humidity: 255,
      id: 255,
    });
    expect(uplinkHexPayloadToData("000000ff")).toEqual({
      temperature: 0,
      co2: 0,
      humidity: 0,
      id: 255,
    });
    expect(uplinkHexPayloadToData("ff000000")).toEqual({
      temperature: 255,
      co2: 0,
      humidity: 0,
      id: 0,
    });
    expect(uplinkHexPayloadToData("00ff0000")).toEqual({
      temperature: 0,
      co2: 255,
      humidity: 0,
      id: 0,
    });
    expect(uplinkHexPayloadToData("0000ff00")).toEqual({
      temperature: 0,
      co2: 0,
      humidity: 255,
      id: 0,
    });
    expect(uplinkHexPayloadToData("000000ff")).toEqual({
      temperature: 0,
      co2: 0,
      humidity: 0,
      id: 255,
    });
  });
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
        ackId: 255,
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
    ).toEqual("ffffffffffffff");
  });
});

describe("converting between payload and original id", () => {
  it("should return correct payload id", () => {
    expect(payloadIdFromOriginalId(1)).toEqual(1);
    expect(payloadIdFromOriginalId(255)).toEqual(255);
    expect(payloadIdFromOriginalId(256)).toEqual(1);

    expect(payloadIdFromOriginalId(510)).toEqual(255);
    expect(payloadIdFromOriginalId(511)).toEqual(1);
  });

  it("should return correct original id", () => {
    expect(originalIdFromPayloadId(1, 1)).toEqual(1);
    expect(originalIdFromPayloadId(255, 255)).toEqual(255);
    expect(originalIdFromPayloadId(1, 256)).toEqual(256);

    expect(originalIdFromPayloadId(255, 510)).toEqual(510);
    expect(originalIdFromPayloadId(1, 511)).toEqual(511);
  });
});
