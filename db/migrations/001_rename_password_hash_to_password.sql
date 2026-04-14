-- Fix: column "password" does not exist
-- Many schemas use "password_hash" instead. This renames it so the app matches db/schema.sql.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'password_hash'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'password'
  ) THEN
    ALTER TABLE users RENAME COLUMN password_hash TO password;
  END IF;
END $$;
