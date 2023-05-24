-- CreateTable
CREATE TABLE "SpeciesLogs" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "plantSpeciesName" TEXT NOT NULL,

    CONSTRAINT "SpeciesLogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SpeciesLogs" ADD CONSTRAINT "SpeciesLogs_plantSpeciesName_fkey" FOREIGN KEY ("plantSpeciesName") REFERENCES "PlantSpecies"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
