import { NextResponse } from "next/server";
import { ensureDbConnected } from "@/lib/dbConnect";
import Questions from "@/Model/Question";

export async function GET(req) {
  try {
    await ensureDbConnected();

    const questions = await Questions.find({})
      .sort({ updatedAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({
      success: true,
      data: questions,
      status: 200,
      msg: "GET request processed successfully",
    });
  } catch (error) {
    console.error("Error processing GET request:", error);
    return NextResponse.json({
      success: false,
      status: 500,
      msg: "Internal server error",
    });
  }
}
