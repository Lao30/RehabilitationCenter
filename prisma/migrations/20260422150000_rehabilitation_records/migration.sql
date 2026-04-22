-- CreateTable
CREATE TABLE "rehabilitation_records" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "branch_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "session_number" INTEGER NOT NULL DEFAULT 1,
    "record_date" DATE NOT NULL,
    "therapist_name" VARCHAR(200),
    "complaints" TEXT,
    "program_therapy" TEXT,
    "assessment" VARCHAR(120),
    "motorik_adl" VARCHAR(160),
    "note_clinical" TEXT,
    "note_progress" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rehabilitation_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rehabilitation_records_branch_record_idx" ON "rehabilitation_records"("branch_id", "record_date" DESC);

-- CreateIndex
CREATE INDEX "rehabilitation_records_patient_record_idx" ON "rehabilitation_records"("patient_id", "record_date" DESC);

-- AddForeignKey
ALTER TABLE "rehabilitation_records" ADD CONSTRAINT "rehabilitation_records_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rehabilitation_records" ADD CONSTRAINT "rehabilitation_records_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
