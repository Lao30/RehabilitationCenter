import * as jose from "jose";

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (secret) return new TextEncoder().encode(secret);
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set in production");
  }
  return new TextEncoder().encode(
    "dev-only-insecure-jwt-secret-min-32-chars!!",
  );
}

/**
 * @param {Record<string, unknown>} payload
 */
export async function signSessionToken(payload) {
  const key = getSecretKey();
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

/**
 * @param {string} token
 */
export async function verifySessionToken(token) {
  const key = getSecretKey();
  const { payload } = await jose.jwtVerify(token, key);
  return payload;
}
