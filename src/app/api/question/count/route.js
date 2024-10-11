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
        msg: "Questions not found",
      });
    }

    // คำนวณจำนวนคำถามทั้งหมดจากทุกหมวดหมู่
    const totalQuestions = questions.categories.reduce((total, category) => {
      return total + category.questions.length;
    }, 0);

    // คำนวณจำนวนคำถามในแต่ละหมวดหมู่
    const categoryCounts = questions.categories.map((category) => ({
      categoryName: category.name,
      questionCount: category.questions.length,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalQuestions, // จำนวนคำถามทั้งหมด
        categoryCounts, // จำนวนคำถามในแต่ละหมวดหมู่
      },
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
