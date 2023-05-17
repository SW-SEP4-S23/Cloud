import { Test, TestingModule } from "@nestjs/testing";
import { NewThresholdDTO, newThresholdChecker } from "./newThresholdDTO";

describe("NewValsDTO", () => {
  let provider: NewThresholdDTO;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewThresholdDTO],
    }).compile();

    provider = module.get<NewThresholdDTO>(NewThresholdDTO);
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
});
