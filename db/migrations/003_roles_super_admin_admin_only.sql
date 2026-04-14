-- Run after updating data: set former therapist accounts to ADMIN or delete them.
-- Then align the CHECK constraint with db/schema.sql (Super Admin + Admin only).

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_role_check CHECK (role IN ('SUPER_ADMIN', 'ADMIN'));
