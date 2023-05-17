import { max } from "class-validator";
import * as Request from "supertest";

export interface CommonTestsInterfaces {
  getThresholds: (
    request: any, //What is the type of this? I tried Request.SuperTest<Request.Test> but it didn't work :(
    path: string,
    minValue: number,
    maxValue: number,
    toleranceInMilliseconds: number,
  ) => void;

  patchThresholds: (
    request: any,
    path: string,
    minValue: number,
    maxValue: number,
    toleranceInMilliseconds: number,
  ) => void;
}

export const commonTests: CommonTestsInterfaces = {
  getThresholds:
    (request, path, minValue, maxValue, toleranceInMilliseconds) =>
    async () => {
      const date = new Date();

      const response = await request.get(path);

      expect(response.body.minVal).toBe(minValue);
      expect(response.body.maxVal).toBe(maxValue);
      expect(response.body.dateChanged).toBeNull();

      const requestDate = new Date(response.body.requestDate);
      expect(requestDate.getTime()).toBeGreaterThanOrEqual(
        date.getTime() - toleranceInMilliseconds,
      );
      expect(requestDate.getTime()).toBeLessThanOrEqual(
        date.getTime() + toleranceInMilliseconds,
      );
    },

  patchThresholds:
    (request, path, minValue, maxValue, toleranceInMilliseconds) =>
    async () => {
      const date = new Date();

      const response = await request.patch(path).send({
        minValue,
        maxValue,
      });

      expect(response.body.minValueReq).toBe(minValue);
      expect(response.body.maxValueReq).toBe(maxValue);

      const requestDate = new Date(response.body.requestDate);
      expect(requestDate.getTime()).toBeGreaterThanOrEqual(
        date.getTime() - toleranceInMilliseconds,
      );
      expect(requestDate.getTime()).toBeLessThanOrEqual(
        date.getTime() + toleranceInMilliseconds,
      );
    },
};
