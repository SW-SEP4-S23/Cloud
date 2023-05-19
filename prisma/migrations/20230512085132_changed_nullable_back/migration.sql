/*
  Warnings:

  - Made the column `dateChanged` on table `DataPointThresholds` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DataPointThresholds" ALTER COLUMN "dateChanged" SET NOT NULL;
