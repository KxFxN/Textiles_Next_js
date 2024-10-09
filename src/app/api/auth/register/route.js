// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import Users from "@/Model/User";
import { ensureDbConnected } from "@/lib/dbConnect";
import { rateLimit } from "@/lib/rateLimit";

const limiter = rateLimit();

export async function POST(req) {
  try {
    // Rate limiting
    try {
      await limiter.check(req, 3, 'CACHE_TOKEN_REGISTER'); // 3 registration attempts per minute
    } catch {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    await ensureDbConnected();

    const {
      companyName,
      firstName,
      lastName,
      email,
      password,
      position,
      department,
      phone,
    } = await req.json();

    // Input validation
    if (!companyName || !firstName || !lastName || !email || !password || !position || !department || !phone) {
      return NextResponse.json({
        success: false,
        status: 400,
        msg: "All fields are required",
      });
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({
        success: false,
        status: 400,
        msg: "Invalid email format",
      });
    }

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({
        success: false,
        status: 400,
        msg: "Password must be at least 8 characters long",
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

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new Users({
      companyName,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "user",
      position,
      department,
      phone,
      isActive: true,
    });

    const savedUser = await newUser.save();

    return NextResponse.json({
      success: true,
      data: {
        id: savedUser._id,
        email: savedUser.email,
        role: savedUser.role,
      },
      status: 201,
      msg: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({
      success: false,
      status: 500,
      msg: "An error occurred during registration",
    });
  }
}