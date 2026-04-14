-- Minimal `users` table (matches RCMS app). Replaces older Supabase-style tables with extra columns.
-- Apply after backup if needed: psql "$DATABASE_URL" -f db/schema.sql

DROP TABLE IF EXISTS public.users CASCADE;

CREATE TABLE public.users (
  user_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  role VARCHAR(20) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'ADMIN')),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX users_email_lower_idx ON public.users (lower(trim(email)));

COMMENT ON COLUMN public.users.password IS 'Bcrypt hash — generate with: pnpm hash-password';
