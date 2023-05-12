import { translateHex } from "./hex-utils";

describe("translateHex", () => {
  it("it should return an array of 3 numbers", () => {
    expect(translateHex("000000")).toHaveLength(3);
  });

  it("it should return the correct values", () => {
    expect(translateHex("000000")).toEqual([0, 0, 0]);
    expect(translateHex("ffffff")).toEqual([255, 255, 255]);
    expect(translateHex("ff0000")).toEqual([255, 0, 0]);
    expect(translateHex("00ff00")).toEqual([0, 255, 0]);
    expect(translateHex("0000ff")).toEqual([0, 0, 255]);
  });
});
