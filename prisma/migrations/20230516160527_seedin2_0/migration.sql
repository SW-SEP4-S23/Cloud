/*
  Warnings:

  - You are about to drop the `Acks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ThresholdRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ThresholdRequest" DROP CONSTRAINT "ThresholdRequest_ack_id_fkey";

-- DropForeignKey
ALTER TABLE "ThresholdRequest" DROP CONSTRAINT "ThresholdRequest_dataType_fkey";

-- AlterTable
ALTER TABLE "Thresholds" ALTER COLUMN "minVal" DROP NOT NULL,
ALTER COLUMN "maxVal" DROP NOT NULL;

-- DropTable
DROP TABLE "Acks";

-- DropTable
DROP TABLE "ThresholdRequest";

-- CreateTable
CREATE TABLE "ThresholdRequests" (
    "id" SERIAL NOT NULL,
    "dataType" "DataType" NOT NULL,
    "minValReq" DOUBLE PRECISION NOT NULL,
    "maxValReq" DOUBLE PRECISION NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL,
    "ack_id" INTEGER,

    CONSTRAINT "ThresholdRequests_pkey" PRIMARY KEY ("id","dataType")
);

-- CreateTable
CREATE TABLE "Ack" (
    "id" SERIAL NOT NULL,
    "dateRecieved" TIMESTAMP(3) NOT NULL,
    "acked" BOOLEAN NOT NULL,

    CONSTRAINT "Ack_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ThresholdRequests" ADD CONSTRAINT "ThresholdRequests_dataType_fkey" FOREIGN KEY ("dataType") REFERENCES "Thresholds"("dataType") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThresholdRequests" ADD CONSTRAINT "ThresholdRequests_ack_id_fkey" FOREIGN KEY ("ack_id") REFERENCES "Ack"("id") ON DELETE SET NULL ON UPDATE CASCADE;
