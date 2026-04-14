import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("Usage: pnpm exec node scripts/hash-password.mjs <plain-password>");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
console.log(hash);
