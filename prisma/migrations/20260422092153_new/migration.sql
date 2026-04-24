-- DropForeignKey
ALTER TABLE "rehabilitation_records" DROP CONSTRAINT "rehabilitation_records_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "rehabilitation_records" DROP CONSTRAINT "rehabilitation_records_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "therapists" DROP CONSTRAINT "therapists_branch_id_fkey";

-- AlterTable
ALTER TABLE "therapists" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "rehabilitation_records" ADD CONSTRAINT "rehabilitation_records_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rehabilitation_records" ADD CONSTRAINT "rehabilitation_records_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "therapists" ADD CONSTRAINT "therapists_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
