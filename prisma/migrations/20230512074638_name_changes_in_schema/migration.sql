/*
  Warnings:

  - You are about to drop the `DataPointThreshholds` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "DataPointThreshholds";

-- CreateTable
CREATE TABLE "DataPointThresholds" (
    "dataType" "DataType" NOT NULL,
    "minVal" DOUBLE PRECISION NOT NULL,
    "maxVal" DOUBLE PRECISION NOT NULL,
    "dateChanged" TIMESTAMP(3) NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataPointThresholds_pkey" PRIMARY KEY ("dataType")
);
