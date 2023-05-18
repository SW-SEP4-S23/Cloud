import { DataType } from "@prisma/client";
import * as Request from "supertest";

export const postThresholds = async (
  httpServer: any,
  path: string,
  minimumValue: number,
  maximumValue: number,
  toleranceInMilliseconds: number,
  DataType: DataType,
) => {
  const date = new Date();

  const httpRequest = Request(httpServer);

  const response = await httpRequest
    .post(path)
    .send({
      minValue: minimumValue,
      maxValue: maximumValue,
    })
    .expect(201);

  expect(response.body.minValueReq).toBe(minimumValue);
  expect(response.body.maxValueReq).toBe(maximumValue);
  expect(response.body.dataType).toBe(DataType);

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
  dataType: string,
) => {
  const httpRequest = Request(httpServer);

  const response = await httpRequest.get(path);

  //Currently only will get NULL values, since the "Thresholds" table is empty until an ACK is received
  expect(response.body.minValue).toBe(null);
  expect(response.body.maxValue).toBe(null);

  expect(response.body.dataType).toBe(dataType);
};
