/*
  Warnings:

  - You are about to drop the column `ps_Id` on the `PlantBatch` table. All the data in the column will be lost.
  - The primary key for the `PlantSpecies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PlantSpecies` table. All the data in the column will be lost.
  - Added the required column `ps_Name` to the `PlantBatch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlantBatch" DROP CONSTRAINT "PlantBatch_ps_Id_fkey";

-- AlterTable
ALTER TABLE "PlantBatch" DROP COLUMN "ps_Id",
ADD COLUMN     "ps_Name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PlantSpecies" DROP CONSTRAINT "PlantSpecies_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "PlantSpecies_pkey" PRIMARY KEY ("name");

-- AddForeignKey
ALTER TABLE "PlantBatch" ADD CONSTRAINT "PlantBatch_ps_Name_fkey" FOREIGN KEY ("ps_Name") REFERENCES "PlantSpecies"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
