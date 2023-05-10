/*
  Warnings:

  - Added the required column `updated` to the `DataPointThreshholds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataPointThreshholds" ADD COLUMN     "updated" BOOLEAN NOT NULL;
