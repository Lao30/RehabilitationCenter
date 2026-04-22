-- CreateTable
CREATE TABLE "wa_notification_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "branch_id" UUID NOT NULL,
    "guardian_id" UUID,
    "recipient_name" VARCHAR(200) NOT NULL,
    "recipient_phone" VARCHAR(50) NOT NULL,
    "template_key" VARCHAR(64) NOT NULL,
    "message_body" TEXT NOT NULL,
    "status" VARCHAR(32) NOT NULL DEFAULT 'terkirim',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wa_notification_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_wa_logs_branch_created" ON "wa_notification_logs"("branch_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "wa_notification_logs" ADD CONSTRAINT "wa_notification_logs_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "wa_notification_logs" ADD CONSTRAINT "wa_notification_logs_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "guardians"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
