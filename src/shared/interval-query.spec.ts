import { Test, TestingModule } from "@nestjs/testing";
import { IntervalQuery, intervalQueryChecker } from "./interval-query";

describe("IntervalQuery", () => {
  let intervalQuery: IntervalQuery;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [IntervalQuery],
    }).compile();

    intervalQuery = app.get(IntervalQuery);
  });

  describe("root", () => {
    it("should return an IntervalQuery", () => {
      expect(intervalQuery).toBeInstanceOf(IntervalQuery);
    });
  });

  describe("intervalQueryChecker", () => {
    it("should throw an error if startDate is after endDate", () => {
      intervalQuery.startDate = new Date("2020-01-01");
      intervalQuery.endDate = new Date("2019-01-01");
      expect(() => intervalQueryChecker(intervalQuery)).toThrowError(
        "Start date cannot be after end date",
      );
    });
  });

  it("should not throw an error if startDate is before endDate", () => {
    intervalQuery.startDate = new Date("2019-01-01");
    intervalQuery.endDate = new Date("2020-01-01");
    expect(() => intervalQueryChecker(intervalQuery)).not.toThrowError(
      "Start date cannot be after end date",
    );
  });
});
