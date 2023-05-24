import { HttpServer } from "@nestjs/common";
import { DataType } from "@prisma/client";
import * as Request from "supertest";

const toleranceInMilliseconds = 60000; //1 minute

export const postThresholds = async (
  httpServer: HttpServer,
  path: string,
  minimumValue: number,
  maximumValue: number,
  dataType: DataType,
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
  expect(response.body.dataType).toBe(dataType);

  const requestDate = new Date(response.body.requestDate);
  expect(requestDate.getTime()).toBeGreaterThanOrEqual(
    date.getTime() - toleranceInMilliseconds,
  );
  expect(requestDate.getTime()).toBeLessThanOrEqual(
    date.getTime() + toleranceInMilliseconds,
  );
};

export const getThresholds = async (
  httpServer: HttpServer,
  path: string,
  dataType: DataType,
) => {
  const httpRequest = Request(httpServer);

  const response = await httpRequest.get(path);

  //Currently only will get NULL values, since the "Thresholds" table is empty until an ACK is received
  expect(response.body.upToDateThreshold.minValue).toBe(null);
  expect(response.body.upToDateThreshold.maxValue).toBe(null);

  expect(response.body.upToDateThreshold.dataType).toBe(dataType);
};

export const postAndCheckForPendingThresholds = async (
  httpServer: any,
  path: string,
  dataType: DataType,
  minimumValue: number,
  maximumValue: number,
) => {
  const date = new Date();

  const httpRequest = Request(httpServer);

  const postResponse = await httpRequest.post(path).send({
    minValue: minimumValue,
    maxValue: maximumValue,
  });

  expect(postResponse.body.minValueReq).toBe(minimumValue);
  expect(postResponse.body.maxValueReq).toBe(maximumValue);
  expect(postResponse.body.dataType).toBe(dataType);

  const requestDate = new Date(postResponse.body.requestDate);
  expect(requestDate.getTime()).toBeGreaterThanOrEqual(
    date.getTime() - toleranceInMilliseconds,
  );
  expect(requestDate.getTime()).toBeLessThanOrEqual(
    date.getTime() + toleranceInMilliseconds,
  );

  //Now checking if the post is pending

  const getResponse = await httpRequest.get(path);

  expect(getResponse.body.pendingThreshold.minValueReq).toBe(minimumValue);
  expect(getResponse.body.pendingThreshold.maxValueReq).toBe(maximumValue);
  expect(getResponse.body.pendingThreshold.dataType).toBe(dataType);
};
