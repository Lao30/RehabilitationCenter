-- Super Admin user for RCMS (table: public.users — see db/schema.sql)
--
-- 1) Generate a bcrypt hash (from my-app folder):
--      pnpm hash-password "YourLoginPassword"
-- 2) Replace PASTE_BCRYPT_HASH below with that full line (starts with $2b$).
-- 3) Set your display name and email.
-- 4) Run in pgAdmin / psql / Supabase SQL editor:
--      psql "$DATABASE_URL" -f db/insert-super-admin.sql
--    Or paste only the INSERT block.

INSERT INTO public.users (name, email, password, phone, role, status)
VALUES (
  'Super Admin',
  'admin@example.com',
  'PASTE_BCRYPT_HASH',
  NULL,
  'SUPER_ADMIN',
  'active'
);
