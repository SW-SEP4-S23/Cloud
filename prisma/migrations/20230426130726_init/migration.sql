-- CreateTable
CREATE TABLE "Datapoint" (
    "timestamp" TIMESTAMP(3) NOT NULL,
    "co2" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "temp" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Datapoint_pkey" PRIMARY KEY ("timestamp")
);
