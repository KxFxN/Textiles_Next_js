import { NextResponse } from "next/server";
import { ensureDbConnected } from "@/lib/dbConnect";
import Questions from "@/Model/Question";

export async function GET(req) {
  try {
    await ensureDbConnected();

    const questions = await Questions.findOne();

    if (!questions) {
      return NextResponse.json({
        success: false,
        status: 404,
        msg: "questions not found",
      });
    }

    // Calculate total questions from all categories
    const totalQuestions = questions.categories.reduce((total, category) => {
      return total + category.questions.length;
    }, 0);

    return NextResponse.json({
      success: true,
      data: totalQuestions,
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
