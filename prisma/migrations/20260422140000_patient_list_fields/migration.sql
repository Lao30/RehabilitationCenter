-- AlterTable
ALTER TABLE "patients" ADD COLUMN "address" TEXT;

-- AlterTable
ALTER TABLE "patients" ADD COLUMN "barthel_score" INTEGER;

-- AlterTable
ALTER TABLE "patients" ADD COLUMN "primary_therapist_name" VARCHAR(200);
