-- Rehabilitation Center Management — PostgreSQL schema
-- Requires PostgreSQL 13+ (uses gen_random_uuid()).
-- Run as a superuser or a role with CREATE privileges on the target database:
--   psql -U postgres -d your_database -f schema.sql

BEGIN;

-- ---------------------------------------------------------------------------
-- Roles (matches application RBAC)
-- ---------------------------------------------------------------------------
CREATE TYPE app_role AS ENUM (
  'SUPER_ADMIN',
  'ADMIN',
  'THERAPIST'
);

-- ---------------------------------------------------------------------------
-- Branches (locations)
-- ---------------------------------------------------------------------------
CREATE TABLE branches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  code            VARCHAR(64) UNIQUE,
  address         TEXT,
  phone           VARCHAR(50),
  timezone        VARCHAR(64) NOT NULL DEFAULT 'UTC',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_branches_active ON branches (is_active) WHERE is_active = TRUE;

-- ---------------------------------------------------------------------------
-- Users (staff; includes admins and therapists)
-- ---------------------------------------------------------------------------
CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             VARCHAR(320) NOT NULL UNIQUE,
  password_hash     VARCHAR(255) NOT NULL,
  full_name         VARCHAR(255) NOT NULL,
  role              app_role NOT NULL,
  branch_id         UUID REFERENCES branches (id) ON DELETE RESTRICT,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at     TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_users_branch_role CHECK (
    (role = 'SUPER_ADMIN' AND branch_id IS NULL)
    OR (role IN ('ADMIN', 'THERAPIST') AND branch_id IS NOT NULL)
  )
);

CREATE INDEX idx_users_branch ON users (branch_id);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_email_lower ON users (LOWER(email));

-- ---------------------------------------------------------------------------
-- Patients (per branch)
-- ---------------------------------------------------------------------------
CREATE TABLE patients (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id           UUID NOT NULL REFERENCES branches (id) ON DELETE RESTRICT,
  medical_record_no   VARCHAR(64),
  first_name          VARCHAR(120) NOT NULL,
  last_name           VARCHAR(120) NOT NULL,
  date_of_birth       DATE,
  phone               VARCHAR(50),
  email               VARCHAR(320),
  notes               TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_patients_branch_mrn UNIQUE (branch_id, medical_record_no)
);

CREATE INDEX idx_patients_branch ON patients (branch_id);
CREATE INDEX idx_patients_name ON patients (branch_id, last_name, first_name);

-- ---------------------------------------------------------------------------
-- Therapy sessions
-- ---------------------------------------------------------------------------
CREATE TABLE therapy_sessions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id           UUID NOT NULL REFERENCES branches (id) ON DELETE RESTRICT,
  patient_id          UUID NOT NULL REFERENCES patients (id) ON DELETE RESTRICT,
  therapist_user_id   UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  scheduled_start     TIMESTAMPTZ NOT NULL,
  scheduled_end       TIMESTAMPTZ,
  status              VARCHAR(32) NOT NULL DEFAULT 'scheduled'
    CHECK (status IN (
      'scheduled', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show'
    )),
  room_label          VARCHAR(64),
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_branch_time ON therapy_sessions (branch_id, scheduled_start);
CREATE INDEX idx_sessions_patient ON therapy_sessions (patient_id);
CREATE INDEX idx_sessions_therapist ON therapy_sessions (therapist_user_id);
CREATE INDEX idx_sessions_status ON therapy_sessions (branch_id, status);

-- ---------------------------------------------------------------------------
-- Queue (waiting list / triage per branch)
-- ---------------------------------------------------------------------------
CREATE TABLE queue_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id       UUID NOT NULL REFERENCES branches (id) ON DELETE RESTRICT,
  patient_id      UUID NOT NULL REFERENCES patients (id) ON DELETE RESTRICT,
  priority        INTEGER NOT NULL DEFAULT 0,
  status          VARCHAR(32) NOT NULL DEFAULT 'waiting'
    CHECK (status IN ('waiting', 'called', 'serving', 'done', 'cancelled')),
  session_id      UUID REFERENCES therapy_sessions (id) ON DELETE SET NULL,
  queued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  called_at       TIMESTAMPTZ,
  notes           VARCHAR(500)
);

CREATE INDEX idx_queue_branch_status ON queue_entries (branch_id, status);
CREATE INDEX idx_queue_queued_at ON queue_entries (branch_id, queued_at);

-- ---------------------------------------------------------------------------
-- Notifications (in-app / outbound log)
-- ---------------------------------------------------------------------------
CREATE TABLE notifications (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id             UUID REFERENCES branches (id) ON DELETE CASCADE,
  recipient_user_id     UUID REFERENCES users (id) ON DELETE CASCADE,
  recipient_patient_id  UUID REFERENCES patients (id) ON DELETE CASCADE,
  channel               VARCHAR(32) NOT NULL DEFAULT 'in_app'
    CHECK (channel IN ('in_app', 'email', 'sms')),
  subject               VARCHAR(500),
  body                  TEXT,
  payload               JSONB NOT NULL DEFAULT '{}',
  read_at               TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_notification_recipient CHECK (
    (recipient_user_id IS NOT NULL)::INT + (recipient_patient_id IS NOT NULL)::INT <= 1
  )
);

CREATE INDEX idx_notifications_user_unread ON notifications (recipient_user_id, read_at)
  WHERE recipient_user_id IS NOT NULL AND read_at IS NULL;
CREATE INDEX idx_notifications_created ON notifications (created_at DESC);

-- ---------------------------------------------------------------------------
-- Audit / system logs
-- ---------------------------------------------------------------------------
CREATE TABLE audit_logs (
  id              BIGSERIAL PRIMARY KEY,
  branch_id       UUID REFERENCES branches (id) ON DELETE SET NULL,
  actor_user_id   UUID REFERENCES users (id) ON DELETE SET NULL,
  action          VARCHAR(128) NOT NULL,
  entity_type     VARCHAR(64),
  entity_id       UUID,
  metadata        JSONB NOT NULL DEFAULT '{}',
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_created ON audit_logs (created_at DESC);
CREATE INDEX idx_audit_actor ON audit_logs (actor_user_id);
CREATE INDEX idx_audit_entity ON audit_logs (entity_type, entity_id);

-- ---------------------------------------------------------------------------
-- System settings (key/value; Super Admin)
-- ---------------------------------------------------------------------------
CREATE TABLE system_settings (
  key                 VARCHAR(128) PRIMARY KEY,
  value               JSONB NOT NULL,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by_user_id  UUID REFERENCES users (id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_branches_updated
  BEFORE UPDATE ON branches
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER tr_users_updated
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER tr_patients_updated
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER tr_therapy_sessions_updated
  BEFORE UPDATE ON therapy_sessions
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

COMMENT ON TABLE branches IS 'Clinic / rehab locations';
COMMENT ON TABLE users IS 'Staff accounts; SUPER_ADMIN has no branch_id';
COMMENT ON TABLE patients IS 'Patients scoped to a branch';
COMMENT ON TABLE therapy_sessions IS 'Scheduled or completed therapy visits';
COMMENT ON TABLE queue_entries IS 'Front-desk queue per branch';
COMMENT ON TABLE notifications IS 'Messages to users or patients';
COMMENT ON TABLE audit_logs IS 'Security and audit trail';
COMMENT ON TABLE system_settings IS 'Global configuration key/value store';

COMMIT;
