import { NextResponse } from "next/server";
import { ensureDbConnected } from "@/lib/dbConnect";
import Scores from "@/Model/Score";
import Users from "@/Model/User";

export async function GET(req, { params }) {
  try {
    await ensureDbConnected();

    const result = await Scores.find({ user: params.id })
      .populate({
        path: "user",
        model: Users,
        select: "-password",
      })
      .populate({
        path: "scores",
        select: "-_id",
      })
      .sort({ updatedAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({
      success: true,
      data: result,
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
