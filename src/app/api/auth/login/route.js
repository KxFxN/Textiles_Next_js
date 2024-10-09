// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import Users from "@/Model/User";
import bcrypt from "bcrypt";
import { ensureDbConnected } from "@/lib/dbConnect";
import { rateLimit } from "@/lib/rateLimit";

const limiter = rateLimit();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export async function POST(req) {
  try {
    // Rate limiting
    try {
      await limiter.check(req, 5, "CACHE_TOKEN_LOGIN"); // 5 login attempts per minute
    } catch {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }

    await ensureDbConnected();

    const { email, password } = await req.json();

    if (
      !email ||
      !password ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid email or password format" },
        { status: 400 }
      );
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(JWT_SECRET);

    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      companyName: user.companyName,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .sign(secret);

    const refreshToken = await new SignJWT({
      userId: user._id.toString(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60,
      path: "/",
    });

    cookies().set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({
      message: "Login successful",
      user: {
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
