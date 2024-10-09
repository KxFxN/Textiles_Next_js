import { NextResponse } from "next/server";
import Users from "@/Model/User";
import { ensureDbConnected } from "@/lib/dbConnect";
import { rateLimit } from "@/lib/rateLimit";

const limiter = rateLimit();

export async function POST(req) {
  try {
    // Rate limiting
    try {
      await limiter.check(req, 10, 'CACHE_TOKEN_CHECK_EMAIL'); // 10 requests per minute
    } catch {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    await ensureDbConnected();

    const { email } = await req.json();

    // Input validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({
        success: false,
        status: 400,
        msg: "Invalid email format",
      });
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        status: 400,
        msg: "User with this email already exists",
      });
    }

    return NextResponse.json({
      success: true,
      status: 200,
      msg: "You can use this email",
    });
  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json({
      success: false,
      status: 500,
      msg: "An error occurred during email check",
    });
  }
}