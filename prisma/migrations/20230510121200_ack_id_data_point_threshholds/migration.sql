/*
  Warnings:

  - Added the required column `ackId` to the `DataPointThreshholds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataPointThreshholds" ADD COLUMN     "ackId" DOUBLE PRECISION NOT NULL;
