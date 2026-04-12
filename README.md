# Rehabilitation Center Management System (RCMS)

Next.js app for role-based clinic and therapy operations (Super Admin, Admin, Therapist).

## Getting Started

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Copy `.env.example` to `.env.local` and set `JWT_SECRET` and `DATABASE_URL` as needed.

## Stack

- [Next.js](https://nextjs.org)
- PostgreSQL (`pg`) for health checks / future persistence
- JWT sessions (`jose`)

## Deploy

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
