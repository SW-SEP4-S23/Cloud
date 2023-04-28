/*
  Warnings:

  - You are about to drop the column `temp` on the `Datapoint` table. All the data in the column will be lost.
  - Added the required column `temperature` to the `Datapoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Datapoint" DROP COLUMN "temp",
ADD COLUMN     "temperature" DOUBLE PRECISION NOT NULL;
