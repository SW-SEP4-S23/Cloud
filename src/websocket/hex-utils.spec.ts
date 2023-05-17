import { hexToNumberArray } from "./hex-utils";

describe("translateHex", () => {
  it("it should return an array of 3 numbers", () => {
    expect(hexToNumberArray("000000")).toHaveLength(3);
  });

  it("it should return the correct values", () => {
    expect(hexToNumberArray("000000")).toEqual([0, 0, 0]);
    expect(hexToNumberArray("ffffff")).toEqual([255, 255, 255]);
    expect(hexToNumberArray("ff0000")).toEqual([255, 0, 0]);
    expect(hexToNumberArray("00ff00")).toEqual([0, 255, 0]);
    expect(hexToNumberArray("0000ff")).toEqual([0, 0, 255]);
  });
});
