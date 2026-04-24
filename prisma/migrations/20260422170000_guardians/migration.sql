-- CreateTable
CREATE TABLE "guardians" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "branch_id" UUID NOT NULL,
    "full_name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "relationship" VARCHAR(40) NOT NULL,
    "last_login_at" TIMESTAMPTZ(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guardians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guardian_patients" (
    "guardian_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,

    CONSTRAINT "guardian_patients_pkey" PRIMARY KEY ("guardian_id", "patient_id")
);

-- CreateIndex (email disimpan lower-case dari aplikasi)
CREATE UNIQUE INDEX "uq_guardian_branch_email" ON "guardians"("branch_id", "email");

-- CreateIndex
CREATE INDEX "idx_guardians_branch" ON "guardians"("branch_id");

-- AddForeignKey
ALTER TABLE "guardians" ADD CONSTRAINT "guardians_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardian_patients" ADD CONSTRAINT "guardian_patients_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "guardians"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardian_patients" ADD CONSTRAINT "guardian_patients_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
