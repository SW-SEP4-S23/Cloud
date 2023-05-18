import * as Request from "supertest";

export const postThresholds = async (
  httpServer: any,
  path: string,
  minValue: number,
  maxValue: number,
  toleranceInMilliseconds: number,
) => {
  const date = new Date();

  const httpRequest = Request(httpServer);

  const response = await httpRequest
    .post(path)
    .send({
      minValue,
      maxValue,
    })
    .expect(201);

  expect(response.body.minValueReq).toBe(minValue);
  expect(response.body.maxValueReq).toBe(maxValue);

  const requestDate = new Date(response.body.requestDate);
  expect(requestDate.getTime()).toBeGreaterThanOrEqual(
    date.getTime() - toleranceInMilliseconds,
  );
  expect(requestDate.getTime()).toBeLessThanOrEqual(
    date.getTime() + toleranceInMilliseconds,
  );
};

export const getThresholds = async (
  httpServer: any,
  path: string,
  minValue: number,
  maxValue: number,
  toleranceInMilliseconds: number,
) => {
  const date = new Date();

  const httpRequest = Request(httpServer);

  const response = await httpRequest.get(path);

  expect(response.body.minValue).toBe(minValue);
  expect(response.body.maxValue).toBe(maxValue);

  const requestDate = new Date(response.body.requestDate);
  expect(requestDate.getTime()).toBeGreaterThanOrEqual(
    date.getTime() - toleranceInMilliseconds,
  );
  expect(requestDate.getTime()).toBeLessThanOrEqual(
    date.getTime() + toleranceInMilliseconds,
  );
};
