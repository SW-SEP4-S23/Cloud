/*
  Warnings:

  - You are about to drop the column `ackId` on the `ThresholdRequests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ThresholdRequests" DROP CONSTRAINT "ThresholdRequests_ackId_fkey";

-- AlterTable
ALTER TABLE "ThresholdRequests" DROP COLUMN "ackId",
ADD COLUMN     "ack_Id" INTEGER;

-- CreateTable
CREATE TABLE "PlantSpecies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "OptimalCo2" DOUBLE PRECISION,
    "optimalHumidity" DOUBLE PRECISION,
    "optimalTemperature" DOUBLE PRECISION,

    CONSTRAINT "PlantSpecies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantBatch" (
    "id" SERIAL NOT NULL,
    "harvestDate" TIMESTAMP(3),
    "plantingDate" TIMESTAMP(3) NOT NULL,
    "ps_Id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "PlantBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plant" (
    "id" SERIAL NOT NULL,
    "pb_Id" INTEGER NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantLogs" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "p_Id" INTEGER NOT NULL,

    CONSTRAINT "PlantLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchLogs" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "pb_Id" INTEGER NOT NULL,

    CONSTRAINT "BatchLogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ThresholdRequests" ADD CONSTRAINT "ThresholdRequests_ack_Id_fkey" FOREIGN KEY ("ack_Id") REFERENCES "Ack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantBatch" ADD CONSTRAINT "PlantBatch_ps_Id_fkey" FOREIGN KEY ("ps_Id") REFERENCES "PlantSpecies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_pb_Id_fkey" FOREIGN KEY ("pb_Id") REFERENCES "PlantBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantLogs" ADD CONSTRAINT "PlantLogs_p_Id_fkey" FOREIGN KEY ("p_Id") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchLogs" ADD CONSTRAINT "BatchLogs_pb_Id_fkey" FOREIGN KEY ("pb_Id") REFERENCES "PlantBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
