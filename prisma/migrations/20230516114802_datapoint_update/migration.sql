/*
  Warnings:

  - The primary key for the `Datapoint` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `co2` on the `Datapoint` table. All the data in the column will be lost.
  - You are about to drop the column `humidity` on the `Datapoint` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `Datapoint` table. All the data in the column will be lost.
  - Added the required column `type` to the `Datapoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Datapoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Datapoint" DROP CONSTRAINT "Datapoint_pkey",
DROP COLUMN "co2",
DROP COLUMN "humidity",
DROP COLUMN "temperature",
ADD COLUMN     "type" "DataType" NOT NULL,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL,
ADD CONSTRAINT "Datapoint_pkey" PRIMARY KEY ("timestamp", "type");
