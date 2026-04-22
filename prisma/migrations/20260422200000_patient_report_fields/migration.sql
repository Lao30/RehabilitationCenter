-- AlterTable
ALTER TABLE "patients" ADD COLUMN "payment_category" VARCHAR(32);

-- AlterTable
ALTER TABLE "patients" ADD COLUMN "primary_diagnosis" VARCHAR(200);
