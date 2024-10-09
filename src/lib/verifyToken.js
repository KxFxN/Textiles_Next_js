import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "Nakarin14299";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export async function verifyToken(token) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
