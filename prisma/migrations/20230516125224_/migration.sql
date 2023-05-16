/*
  Warnings:

  - The primary key for the `Acks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Acks` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - The primary key for the `ThresholdRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `ThresholdRequest` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `ack_id` on the `ThresholdRequest` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "ThresholdRequest" DROP CONSTRAINT "ThresholdRequest_ack_id_fkey";

-- AlterTable
CREATE SEQUENCE acks_id_seq;
ALTER TABLE "Acks" DROP CONSTRAINT "Acks_pkey",
ALTER COLUMN "id" SET DEFAULT nextval('acks_id_seq'),
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ADD CONSTRAINT "Acks_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE acks_id_seq OWNED BY "Acks"."id";

-- AlterTable
CREATE SEQUENCE thresholdrequest_id_seq;
ALTER TABLE "ThresholdRequest" DROP CONSTRAINT "ThresholdRequest_pkey",
ALTER COLUMN "id" SET DEFAULT nextval('thresholdrequest_id_seq'),
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "ack_id" DROP NOT NULL,
ALTER COLUMN "ack_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "ThresholdRequest_pkey" PRIMARY KEY ("id", "dataType");
ALTER SEQUENCE thresholdrequest_id_seq OWNED BY "ThresholdRequest"."id";

-- AddForeignKey
ALTER TABLE "ThresholdRequest" ADD CONSTRAINT "ThresholdRequest_ack_id_fkey" FOREIGN KEY ("ack_id") REFERENCES "Acks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
