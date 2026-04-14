-- =============================================================================
-- First user for `public.users` (minimal schema — see db/schema.sql)
-- Columns: user_id (serial), name, email, password, phone, role, status, created_at
-- =============================================================================
--
-- BEFORE YOU RUN:
-- 1) From the my-app folder: pnpm hash-password "YourChosenPassword"
-- 2) Copy the bcrypt hash ($2b$10$...).
-- 3) Replace email, hash, and display name below.
-- 4) psql "$DATABASE_URL" -f db/seed-example.sql

INSERT INTO public.users (name, email, password, phone, role, status)
VALUES (
  'Your Full Name',
  'admin@yourdomain.com',
  'PASTE_BCRYPT_HASH_FROM_pnpm_hash-password_HERE',
  NULL,
  'SUPER_ADMIN',
  'active'
);
