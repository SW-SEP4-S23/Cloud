/*
  Warnings:

  - You are about to drop the column `ack_id` on the `ThresholdRequests` table. All the data in the column will be lost.
  - You are about to drop the column `maxValReq` on the `ThresholdRequests` table. All the data in the column will be lost.
  - You are about to drop the column `minValReq` on the `ThresholdRequests` table. All the data in the column will be lost.
  - You are about to drop the column `maxVal` on the `Thresholds` table. All the data in the column will be lost.
  - You are about to drop the column `minVal` on the `Thresholds` table. All the data in the column will be lost.
  - Added the required column `maxValueReq` to the `ThresholdRequests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minValueReq` to the `ThresholdRequests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ThresholdRequests" DROP CONSTRAINT "ThresholdRequests_ack_id_fkey";

-- AlterTable
ALTER TABLE "ThresholdRequests" DROP COLUMN "ack_id",
DROP COLUMN "maxValReq",
DROP COLUMN "minValReq",
ADD COLUMN     "ackId" INTEGER,
ADD COLUMN     "maxValueReq" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "minValueReq" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Thresholds" DROP COLUMN "maxVal",
DROP COLUMN "minVal",
ADD COLUMN     "maxValue" DOUBLE PRECISION,
ADD COLUMN     "minValue" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "ThresholdRequests" ADD CONSTRAINT "ThresholdRequests_ackId_fkey" FOREIGN KEY ("ackId") REFERENCES "Ack"("id") ON DELETE SET NULL ON UPDATE CASCADE;
