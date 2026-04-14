-- Align `public.users` with what the RCMS app expects (see lib/users.js, db/schema.sql).
-- Run: psql "$DATABASE_URL" -f db/migrations/002_align_users_for_app.sql
--
-- Your table must have these columns (not pwd_prefix — the app reads `password`):
--   user_id, name, email, password, phone, role, status, created_at

-- Add missing columns (safe if they already exist in newer Postgres; else run one block at a time)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS password TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS role VARCHAR(20),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT now();

-- Remove mistaken helper column if present (cannot login with a "prefix" — need full bcrypt hash)
ALTER TABLE public.users DROP COLUMN IF EXISTS pwd_prefix;

-- Fill name/role where empty so rows are valid (adjust as needed)
UPDATE public.users
SET
  name = COALESCE(NULLIF(trim(name), ''), split_part(email, '@', 1)),
  role = COALESCE(NULLIF(trim(role), ''), 'SUPER_ADMIN'),
  status = COALESCE(NULLIF(trim(status), ''), 'active')
WHERE name IS NULL OR trim(name) = '' OR role IS NULL OR trim(role) = '' OR status IS NULL OR trim(status) = '';

-- You MUST set a real bcrypt hash on `password` (prefix alone is invalid):
--   cd my-app && pnpm hash-password "YourLoginPassword"
-- Then:
--   UPDATE public.users SET password = '$2b$10$...full_hash...' WHERE email = 'you@example.com';
