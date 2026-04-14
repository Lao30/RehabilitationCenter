-- Branch / center Admin — logs in at /login → redirected to /admin/dashboard (role must be ADMIN).
--
-- 1) From my-app:  pnpm hash-password "YourChosenPassword"
-- 2) Replace PASTE_BCRYPT_HASH below with the full line ($2b$10$...).
-- 3) Set email / name as you like.
-- 4) Run:  psql "$DATABASE_URL" -f db/insert-admin.sql

INSERT INTO public.users (name, email, password, phone, role, status)
VALUES (
  'Center Admin',
  'admin@yourcenter.com',
  'PASTE_BCRYPT_HASH',
  NULL,
  'ADMIN',
  'active'
);
