// middleware.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/verifyToken";

const publicPaths = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/check-email",
  "/auth/login",
  "/auth/register",
];

export async function middleware(request) {
  const token = request.cookies.get("token");
  const decodedToken = token ? await verifyToken(token.value) : null;

  // Redirect authenticated users trying to access login or register pages
  if (
    decodedToken &&
    (request.nextUrl.pathname === "/auth/login" ||
      request.nextUrl.pathname === "/auth/register")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to public paths
  if (publicPaths.some((path) => request.nextUrl.pathname === path)) {
    return NextResponse.next();
  }

  // Protect all other routes
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (!decodedToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
