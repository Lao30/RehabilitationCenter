-- CreateTable
CREATE TABLE "therapists" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "branch_id" UUID NOT NULL,
    "display_name" VARCHAR(200) NOT NULL,
    "specialization" VARCHAR(120) NOT NULL,
    "schedule_days" VARCHAR(240) NOT NULL,
    "schedule_hours" VARCHAR(120) NOT NULL,
    "branch_label" VARCHAR(80) NOT NULL DEFAULT 'Pusat',
    "total_patients" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "therapists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_therapists_branch" ON "therapists"("branch_id");

-- AddForeignKey
ALTER TABLE "therapists" ADD CONSTRAINT "therapists_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
