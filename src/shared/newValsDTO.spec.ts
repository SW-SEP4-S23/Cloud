import { Test, TestingModule } from "@nestjs/testing";
import { NewValsDTO, newValsDTOChecker } from "./newValsDTO";

describe("NewValsDTO", () => {
  let provider: NewValsDTO;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewValsDTO],
    }).compile();

    provider = module.get<NewValsDTO>(NewValsDTO);
  });

  it("should be defined", () => {
    expect(provider).toBeDefined();
  });

  it("should throw an error if tempMin > tempMax", () => {
    provider.tempMin = 10;
    provider.tempMax = 5;
    expect(() => newValsDTOChecker(provider)).toThrowError();
  });

  it("should not throw an error if tempMin < tempMax", () => {
    provider.tempMin = 5;
    provider.tempMax = 10;
    expect(() => newValsDTOChecker(provider)).not.toThrowError();
  });
});
