# Supabase (or any PostgreSQL) — connect and sign in

Your `users` table can include **`password`**, **`full_name`**, **`role`** as enum **`app_role`**, **`branch_id`**, **`is_active`**, etc. The app reads **`role::text`** and bcrypt in **`password`**.

## 1. Put the connection string in the app

1. In Supabase: **Project Settings → Database**.
2. Copy the **URI** (often labeled “Connection string” / “Nodejs”). It looks like:
   `postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres`
3. Paste it into **`my-app/.env.local`** as **`DATABASE_URL=`** (one line, no spaces around `=`).
4. If the password contains `@`, `#`, `%`, etc., **URL-encode** those characters in the password part of the URL.
5. Add a strong **`JWT_SECRET`** (any long random string).
6. Restart **`npm run dev`** after saving.

Test the URL:

```bash
cd my-app
psql "$DATABASE_URL" -c "SELECT 1"
```

If this fails, fix the URL before the app can work.

## 2. Enum `app_role` must allow these labels

The app expects role strings exactly:

`SUPER_ADMIN` · `ADMIN` · `THERAPIST`

In Supabase **SQL Editor**, check your enum:

```sql
SELECT enumlabel
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname = 'app_role'
ORDER BY enumsortorder;
```

If values differ (e.g. lowercase), either change the enum or change the app’s `constants/roles.js` to match (not recommended unless you know what you’re doing).

## 3. Create a user (bcrypt hash in `password`)

**Option A — script (easiest)**

```bash
cd my-app
pnpm db:insert-user "you@yourdomain.com" "YourLoginPassword" SUPER_ADMIN
```

Uses the same **`DATABASE_URL`** as the app. Fills **`full_name`** / **`is_active`** automatically if those columns exist.

**Option B — SQL**

Generate a hash:

```bash
pnpm hash-password "YourLoginPassword"
```

Then in SQL Editor:

```sql
INSERT INTO public.users (email, password, full_name, role, is_active)
VALUES (
  'you@yourdomain.com',
  '$2b$10$...paste hash from pnpm hash-password...',
  'Your Name',
  'SUPER_ADMIN'::app_role,
  true
);
```

Adjust column list if your table differs (e.g. omit `full_name` if not null and you don’t want it).

## 4. Why “Sign-in failed”

| Cause | What to check |
|--------|----------------|
| Wrong email/password | Same email and the **plain** password you used in `db:insert-user` / `hash-password`. |
| Plain text in `password` column | Value must be a **bcrypt hash** (`$2b$10$...`), not the raw password. |
| `DATABASE_URL` wrong | `psql "$DATABASE_URL" -c "SELECT 1"` must succeed. |
| Enum mismatch | `role` value must match an **`app_role`** label the app sends (`SUPER_ADMIN`, etc.). |

## 5. Your screenshot vs the app

- **`password`** column: store **bcrypt hash** only.
- **`role`**: enum must include the three values above (as enum labels).
- **`full_name`**: optional; used for the session display name when present.
