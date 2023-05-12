/*
  Warnings:

  - Made the column `requestDate` on table `DataPointThresholds` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DataPointThresholds" ALTER COLUMN "dateChanged" DROP NOT NULL,
ALTER COLUMN "requestDate" SET NOT NULL;
