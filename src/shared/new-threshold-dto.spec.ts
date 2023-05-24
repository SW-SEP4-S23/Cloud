import { Test, TestingModule } from "@nestjs/testing";
import {
  NewThresholdDTO,
  newThresholdChecker,
  testForHardcodedThresholdsCo2,
  testForHardcodedThresholdsHumidity,
} from "./new-threshold-dto";

describe("NewThresholdDTO Unit Tests", () => {
  let provider: NewThresholdDTO;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewThresholdDTO],
    }).compile();

    provider = module.get(NewThresholdDTO);
  });

  it("should be defined", () => {
    expect(provider).toBeDefined();
  });

  it("should throw an error if tempMin > tempMax", () => {
    provider.minValue = 10;
    provider.maxValue = 5;
    expect(() => newThresholdChecker(provider)).toThrowError();
  });

  it("should not throw an error if tempMin < tempMax", () => {
    provider.minValue = 5;
    provider.maxValue = 10;
    expect(() => newThresholdChecker(provider)).not.toThrowError();
  });

  describe("Hardcoded Thresholds", () => {
    describe("Co2", () => {
      describe("Exceptions", () => {
        it("should throw errro if minValue is < hardcoded min", () => {
          provider.minValue = -1;
          provider.maxValue = 100;
          expect(() => testForHardcodedThresholdsCo2(provider)).toThrowError();
        });

        it("should throw error if maxValue is > hardcoded max", () => {
          provider.minValue = 0;
          provider.maxValue = 1;
          expect(() => testForHardcodedThresholdsCo2(provider)).toThrowError();
        });
      });

      describe("Sunny side scenarios", () => {
        it("Within range", () => {
          provider.minValue = 0.1;
          provider.maxValue = 0.4;
          expect(() =>
            testForHardcodedThresholdsCo2(provider),
          ).not.toThrowError();
        });
      });
    });

    describe("Humidity", () => {
      describe("Exceptions", () => {
        it("should throw error if minValue is < hardcoded min", () => {
          provider.minValue = -1;
          provider.maxValue = 100;
          expect(() =>
            testForHardcodedThresholdsHumidity(provider),
          ).toThrowError();
        });

        it("should throw error if maxValue is > hardcoded max", () => {
          provider.minValue = 0;
          provider.maxValue = 101;
          expect(() =>
            testForHardcodedThresholdsHumidity(provider),
          ).toThrowError();
        });
      });

      describe("Sunny side scenarios", () => {
        it("Should not throw error", () => {
          provider.minValue = 0.1;
          provider.maxValue = 99.9;
          expect(() =>
            testForHardcodedThresholdsHumidity(provider),
          ).not.toThrowError();
        });
      });
    });

    describe("Temperature", () => {
      describe("Exceptions", () => {
        it("should throw error if minValue is < hardcoded min", () => {
          provider.minValue = -41;
          provider.maxValue = 100;
          expect(() =>
            testForHardcodedThresholdsHumidity(provider),
          ).toThrowError();
        });

        it("should throw error if maxValue is > hardcoded max", () => {
          provider.minValue = -40;
          provider.maxValue = 126;
          expect(() =>
            testForHardcodedThresholdsHumidity(provider),
          ).toThrowError();
        });
      });
    });
  });
});
