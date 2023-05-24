/*
  Warnings:

  - You are about to drop the column `pb_Id` on the `BatchLogs` table. All the data in the column will be lost.
  - You are about to drop the column `pb_Id` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `ps_Name` on the `PlantBatch` table. All the data in the column will be lost.
  - You are about to drop the column `p_Id` on the `PlantLogs` table. All the data in the column will be lost.
  - You are about to drop the column `OptimalCo2` on the `PlantSpecies` table. All the data in the column will be lost.
  - You are about to drop the column `plantSpeciesName` on the `SpeciesLogs` table. All the data in the column will be lost.
  - Added the required column `plantBatch_Id` to the `BatchLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plantBatch_Id` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plantSpecies_Name` to the `PlantBatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plant_Id` to the `PlantLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plantSpecies_Name` to the `SpeciesLogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BatchLogs" DROP CONSTRAINT "BatchLogs_pb_Id_fkey";

-- DropForeignKey
ALTER TABLE "Plant" DROP CONSTRAINT "Plant_pb_Id_fkey";

-- DropForeignKey
ALTER TABLE "PlantBatch" DROP CONSTRAINT "PlantBatch_ps_Name_fkey";

-- DropForeignKey
ALTER TABLE "PlantLogs" DROP CONSTRAINT "PlantLogs_p_Id_fkey";

-- DropForeignKey
ALTER TABLE "SpeciesLogs" DROP CONSTRAINT "SpeciesLogs_plantSpeciesName_fkey";

-- AlterTable
ALTER TABLE "BatchLogs" DROP COLUMN "pb_Id",
ADD COLUMN     "plantBatch_Id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Plant" DROP COLUMN "pb_Id",
ADD COLUMN     "plantBatch_Id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PlantBatch" DROP COLUMN "ps_Name",
ADD COLUMN     "plantSpecies_Name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PlantLogs" DROP COLUMN "p_Id",
ADD COLUMN     "plant_Id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PlantSpecies" DROP COLUMN "OptimalCo2",
ADD COLUMN     "optimalCo2" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "SpeciesLogs" DROP COLUMN "plantSpeciesName",
ADD COLUMN     "plantSpecies_Name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PlantBatch" ADD CONSTRAINT "PlantBatch_plantSpecies_Name_fkey" FOREIGN KEY ("plantSpecies_Name") REFERENCES "PlantSpecies"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_plantBatch_Id_fkey" FOREIGN KEY ("plantBatch_Id") REFERENCES "PlantBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeciesLogs" ADD CONSTRAINT "SpeciesLogs_plantSpecies_Name_fkey" FOREIGN KEY ("plantSpecies_Name") REFERENCES "PlantSpecies"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantLogs" ADD CONSTRAINT "PlantLogs_plant_Id_fkey" FOREIGN KEY ("plant_Id") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchLogs" ADD CONSTRAINT "BatchLogs_plantBatch_Id_fkey" FOREIGN KEY ("plantBatch_Id") REFERENCES "PlantBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
