-- CreateEnum
CREATE TYPE "DataType" AS ENUM ('temperature', 'co2', 'humidity');

-- CreateTable
CREATE TABLE "DataPointThreshholds" (
    "dataType" "DataType" NOT NULL,
    "minVal" DOUBLE PRECISION NOT NULL,
    "maxVal" DOUBLE PRECISION NOT NULL,
    "dateChanged" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataPointThreshholds_pkey" PRIMARY KEY ("dataType")
);
