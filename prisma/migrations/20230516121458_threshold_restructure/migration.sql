/*
  Warnings:

  - You are about to drop the `DataPointThresholds` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "DataPointThresholds";

-- CreateTable
CREATE TABLE "Thresholds" (
    "dataType" "DataType" NOT NULL,
    "minVal" DOUBLE PRECISION NOT NULL,
    "maxVal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Thresholds_pkey" PRIMARY KEY ("dataType")
);

-- CreateTable
CREATE TABLE "ThresholdRequest" (
    "id" DOUBLE PRECISION NOT NULL,
    "dataType" "DataType" NOT NULL,
    "minValReq" DOUBLE PRECISION NOT NULL,
    "maxValReq" DOUBLE PRECISION NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL,
    "ack_id" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ThresholdRequest_pkey" PRIMARY KEY ("id","dataType")
);

-- CreateTable
CREATE TABLE "Acks" (
    "id" DOUBLE PRECISION NOT NULL,
    "dateRecieved" TIMESTAMP(3) NOT NULL,
    "acked" BOOLEAN NOT NULL,

    CONSTRAINT "Acks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ThresholdRequest" ADD CONSTRAINT "ThresholdRequest_dataType_fkey" FOREIGN KEY ("dataType") REFERENCES "Thresholds"("dataType") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThresholdRequest" ADD CONSTRAINT "ThresholdRequest_ack_id_fkey" FOREIGN KEY ("ack_id") REFERENCES "Acks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
