# Database setup

**Using Supabase?** See **[SUPABASE.md](./SUPABASE.md)** for connection string, enum `app_role`, and sign-in troubleshooting.

**Empty database — no sign-up UI yet?** Add users in one of these ways:

1. **Script (easiest):** from `my-app` run  
   `pnpm db:insert-user "you@email.com" "YourPassword" SUPER_ADMIN`  
   (uses `DATABASE_URL` in `.env.local`; inserts `name`, `email`, `password` hash, `role`, `status`.)

2. **SQL file:** edit and run **[seed-example.sql](./seed-example.sql)** (paste your bcrypt hash from `pnpm hash-password`).

## Fix: `password authentication failed for user "postgres"` (PostgreSQL code `28P01`)

That message is about **connecting to PostgreSQL** using `DATABASE_URL` in **`.env.local`** — the **database user’s password** (usually `postgres:…` in the URL), **not** the password you use on the website login page.

1. **Use the same password** you use in pgAdmin / `psql` for user `postgres` (or change `postgres` in the URL to whatever user you created).
2. **Special characters** in the DB password (`@`, `#`, `/`, `%`, spaces…) break URLs unless **encoded**. Example: `@` → `%40`. Easiest fix: set a simple Postgres password for dev, or use [encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) on the password part only.
3. **Restart** the Next dev server after editing `.env.local`.
4. **Test the URL:**  
   `psql "$DATABASE_URL" -c "SELECT 1"`  
   If that fails, fix the URL before the app will work.

---

The app uses **Prisma** (`prisma/schema.prisma`) against the same PostgreSQL **`users`** table as **`db/schema.sql`**: **`user_id`**, **`name`**, **`email`**, **`password`**, **`phone`**, **`role`**, **`status`**, **`created_at`**. After `npm install`, run **`npm run db:generate`** if `postinstall` did not run. Prisma CLI does not load **`.env.local`** by default; use **`npm run db:pull`**, **`db:push`**, etc., or put `DATABASE_URL` in a **`.env`** file in `my-app/`.

- **`password`**: stores a **bcrypt hash** (long string starting with `$2b$`). You type a normal password at login; you **insert the hash** into SQL, not the plain password. This is standard and required for security.

## Easiest: add a user without writing SQL

From the **`my-app`** folder (uses `DATABASE_URL` in `.env.local`):

```bash
pnpm db:insert-user "you@yourdomain.com" "YourPlainPassword" SUPER_ADMIN
```

The script hashes the password and inserts the row into the **`password`** column.

If this fails, read the error message printed at the bottom (permissions, missing table, duplicate email, enum type, etc.).

## 1. Fresh database

**Option A — SQL file**

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

**Option B — Prisma (creates/updates tables from `prisma/schema.prisma`)**

```bash
cd my-app && npm run db:push
```

Use the same **`DATABASE_URL`** as in `.env.local`.

## 2. Hash your password (run locally)

```bash
pnpm hash-password "the-password-you-will-type-at-login"
```

Copy the line it prints (the hash).

## 3. Insert a user

```sql
INSERT INTO users (name, email, password, role, status)
VALUES (
  'Your Name',
  'you@yourdomain.com',
  '$2b$10$...paste hash from step 2...',
  'SUPER_ADMIN',
  'active'
);
```

`role` must be exactly: `SUPER_ADMIN` or `ADMIN`.

## 4. Error: column `password` does not exist

Your table probably uses **`password_hash`** (common in older setups). Rename it once:

```bash
psql "$DATABASE_URL" -f db/migrations/001_rename_password_hash_to_password.sql
```

Or run this in your SQL client:

```sql
ALTER TABLE users RENAME COLUMN password_hash TO password;
```

(Only if the column is actually named `password_hash`.)

Then your `INSERT INTO users (name, email, password, role, status) ...` will work.

## 5. You already have an old `users` table (messy / wrong types)

If renaming is not enough, replace the table and start clean:

```sql
DROP TABLE IF EXISTS users CASCADE;
```

Then run **`db/schema.sql`** again and insert as in step 3.

## 6. Verify

```sql
SELECT user_id, email, role, status FROM users;
```

Sign in at `/login` with the same email and the **plain** password you used in `pnpm hash-password`.
